'use client';

import React from 'react';
import Curtains from '@/components/Curtains';
import { motion } from 'framer-motion';
import { useGetAllYatrasQuery } from '@/services/yatraApi';
import { useUpdateAllotmentStatusMutation } from '@/services/registrationApi';
import moment from 'moment';
import ConfettiButton from '@/components/ui/ConfettiButton';
import { toast } from 'react-toastify';


export default function AllotmentPage() {

    const { data: yatras = [], isLoading, error } = useGetAllYatrasQuery();
    const [updateAllotmentStatus] = useUpdateAllotmentStatusMutation();
    const yatraId = localStorage.getItem("admin_selected_yatra_id");
    const SelectedYatra = yatras.find((yatra) => yatra.id === yatraId);

    return (
        <div className="bg-transparent flex flex-col items-center flex-1 h-full font-inter">
            <header className="w-full max-w-6xl mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {SelectedYatra && <div className="space-y-2">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-bold text-heritage-textDark tracking-tight"
                    >
                        {/* Active yatra name */}
                        <span className="text-heritage-textDark font-black">{SelectedYatra.name}</span>
                    </motion.h1>
                </div>}
            </header>

            <main className="w-full max-w-6xl relative flex-1 pb-8 flex flex-col">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 min-h-[400px]"
                >
                    <Curtains>
                        <div className="space-y-6 flex flex-col items-center">
                            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight text-center">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] to-[#00E5FF]">{SelectedYatra?.name}</span>
                            </h2>

                            <div className="inline-block px-6 py-2 bg-white/5 border border-[#4ADE80]/30 rounded-full mb-4">
                                <span className="text-[#4ADE80] font-bold tracking-widest text-lg uppercase underline">
                                    {moment(SelectedYatra?.start_date).format("DD-MMM-YYYY")} - {moment(SelectedYatra?.end_date).format("DD-MMM-YYYY")}
                                </span>
                            </div>

                            <div className="max-w-md w-full mx-auto p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-2 text-center">
                                <p className="text-white text-xl font-black uppercase">Date: {moment(new Date()).format("DD-MMM-YYYY")}</p>
                                <div className="w-12 h-1 bg-[#4ADE80] mx-auto my-4 rounded-full" />
                                <p className="text-slate-400 text-xs font-medium">Inauguration By</p>
                                <p className="text-white text-lg font-black tracking-tight">Hon. Bhaisahib Jaskeeratsingh Mahirwansingh Sodi</p>
                                {/* <p className="text-[#4ADE80] text-[10px] font-black uppercase tracking-[0.2em]">(Director Technical)</p> */}
                            </div>

                            <div className="mt-10">
                                <ConfettiButton
                                    text="Start Room Allotment"
                                    successText="Room Allotement Success!"
                                    onClick={async () => {
                                        if (!yatraId) {
                                            toast.error("No Yatra selected");
                                            return;
                                        }
                                        try {
                                            await updateAllotmentStatus({ yatraId, status: 'alloted' }).unwrap();
                                        } catch (err: any) {
                                            toast.error(err.data?.message || "Failed to start allotment");
                                            throw err; // Important: throw to signal failure to the button
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </Curtains>
                </motion.div>
            </main>
        </div>
    );
}
