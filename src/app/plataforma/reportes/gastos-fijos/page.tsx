import { getGastosFijos } from "@/actions/reportes-action";
import { GastosFijosForm } from "../components/GastosFijosForm";

export default async function GastoFijoPage() {
  const [gastosFijos] = await Promise.all([getGastosFijos()]);
  return (
    <div className="main-container">
      <h1 className="title"> Gastos fijos </h1>
      <GastosFijosForm gastosFijos={gastosFijos} />
    </div>
  );
}
