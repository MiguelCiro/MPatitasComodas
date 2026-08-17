import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(
  request: NextRequest
) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value, options }) => {
              supabaseResponse.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  /*
  ==========================================
  VERIFICAR SESIÓN REAL
  ==========================================
  */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname =
    request.nextUrl.pathname;

  /*
  ==========================================
  PROTEGER TODO /admin
  ==========================================
  */

  if (
    pathname.startsWith("/admin") &&
    !user
  ) {
    const url =
      request.nextUrl.clone();

    url.pathname = "/login";

    return NextResponse.redirect(url);
  }

  /*
  ==========================================
  SI YA ESTÁ AUTENTICADO
  Y VISITA /login
  ==========================================
  */

  if (
    pathname === "/login" &&
    user
  ) {
    const url =
      request.nextUrl.clone();

    url.pathname = "/admin";

    return NextResponse.redirect(url);
  }

  /*
  ==========================================
  CONTINUAR REQUEST
  ==========================================
  */

  return supabaseResponse;
}