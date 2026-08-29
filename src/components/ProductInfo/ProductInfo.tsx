type Props = {
  name: string;
  description: string;
  price: number;
};

export default function ProductInfo({
  name,
  description,
  price,
}: Props) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        {name}
      </h1>

      <p className="mt-4 text-gray-600">
        {description}
      </p>

      <p className="mt-6 text-2xl font-bold text-gray-900">
        ${price.toLocaleString("es-CO")}
      </p>
    </div>
  );
}