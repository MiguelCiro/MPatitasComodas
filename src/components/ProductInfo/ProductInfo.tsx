type Props = {
  brand: string;
  name: string;
  description: string;
  price: number;
};

export default function ProductInfo({
  brand,
  name,
  description,
  price,
}: Props) {

  return (

    <div>

      <p className="text-red-600 font-semibold uppercase">
        {brand}
      </p>

      <h1 className="mt-3 text-5xl font-black">
        {name}
      </h1>

      <p className="mt-6 text-gray-600 leading-8">
        {description}
      </p>

      <p className="mt-10 text-4xl font-black">
        ${price.toLocaleString("es-CO")}
      </p>

    </div>

  );

}