"use client";

import { ClientType } from "@/interfaces";
import { useOrderStore } from "@/store";

interface Props {
  clientTypes: ClientType[];
}

export const SelectClientTypes: React.FC<Props> = ({ clientTypes }) => {
  const {
    setClientType,
    clientType,
  } = useOrderStore();
  
  const handleSelectClientType = (e: any) => {
    const clientType = clientTypes.find(
      (clientType) => clientType.cod_tc === +e.target.value
    );
    if (!clientType) return;
    setClientType(clientType);
  };

  return (
    <div>
      <label htmlFor="client-type">Tipo de cliente: </label>
      <select
        className="select-client"
        name="client-type"
        id="client-type"
        value={clientType?.cod_tc}
        onChange={handleSelectClientType}
      >
        {clientTypes.map((clientType) => (
          <option key={clientType.cod_tc} value={clientType.cod_tc}>
            {clientType.dtipo_cliente}
          </option>
        ))}
      </select>
    </div>
  );
};
