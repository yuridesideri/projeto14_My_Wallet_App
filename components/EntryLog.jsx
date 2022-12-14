import axios from "axios";
import { useEffect, useState } from "react";
import Registry from "./Registry.jsx";
import { parseRegisters } from "../helpers/helpers.js";

export default function EntryLog(props) {
    const [registers, setRegisters] = useState([]);
    const [sessionToken, setSessionToken] = useState('')
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_ROUTE;
    const total = parseRegisters(registers);
    
    useEffect(() => {
            setSessionToken(sessionStorage.getItem('token'));
            axios
                .get(apiUrl + "/transaction", {
                    headers: { authentication: `Bearer ${sessionToken}` },
                })
                .then((res) => {
                    setRegisters(res.data);
                })
                .catch(({ request }) => {
                    console.log(request)
                });
    }, [sessionToken]);
    

    if (registers.length === 0) {
        return (
            <div className="my-[13px] flex h-[446px] w-[326px] flex-col overflow-auto rounded-md bg-white py-[10px] px-[12px] scrollbar-hide pb-0">
                <p className="mx-auto my-auto w-52 text-center text-[20px] font-light text-[#868686]">
                        Não há registros de entrada ou saída
                    </p>
            </div>
        )
    }

    return (
        <div className="relative my-[13px] flex min-h-[446px] w-[326px] flex-col overflow-auto rounded-md bg-white py-[10px] px-[12px] scrollbar-hide pb-0">
            <ul className="mb-8">
                {registers.length > 0 && (
                    registers.map((register, registerInd) => (
                        <Registry key={`Registry- ${registerInd}`} data={register} />
                    ))
                )}
            </ul>
            <div className="grow sticky bottom-0 flex items-end">
                    <div className="min-h-[50px] flex justify-between w-full my-gradient pt-3">
                        <p className="font-bold">SALDO</p>
                        {/* Needs Gradient*/}
                        {total && <p className={`${total > 0 ? "text-[#03AC00]" : "text-[#C70000]"} font-medium`}>{total.replace('.',',')}</p>}
                    </div>
                </div>
        </div>
    );
}
