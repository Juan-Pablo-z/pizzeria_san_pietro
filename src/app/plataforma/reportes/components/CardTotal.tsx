import { formatMoney } from "@/helpers";
import { Card, CardBody, CardHeader, cn } from "@nextui-org/react";

export const CardTotal = ({
  title,
  total,
  headerClassName = "bg-dark",
}: {
  title: string;
  total: number;
  headerClassName?: string;
}) => (
  <Card className="p-4">
    <CardHeader
      className={cn(
        "text-white rounded-lg text-small h-10 p-0 flex flex-col justify-center items-center px-4",
        headerClassName
      )}
    >
      <span>{title}</span>
    </CardHeader>
    <CardBody className="p-0 pt-2 px-2">{formatMoney(total)}</CardBody>
  </Card>
);