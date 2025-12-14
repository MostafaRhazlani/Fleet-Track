import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import Input from "../UI/Input";
import Textarea from "../UI/Textarea";
import PrimaryButton from "../UI/PrimaryButton";
import CustomSelect from "../UI/CustomSelect";
import { useDispatch, useSelector } from "react-redux";
import { fetchDrivers } from "../../store/user/userSlice";
import { setModalOpen } from "../../store/ui/modalSlice";

const TripModal = ({
    open,
    onClose,
    mode = "add",
    initialData = null,
    onSubmit,
}) => {
    const dispatch = useDispatch();
    const uiModalOpen = useSelector((s) => s.modal?.modalOpen);

    const [formData, setFormData] = useState({
        from: "",
        to: "",
        driver: null,
        notes: "",
        status: "planned",
        startDate: "",
        endDate: "",
    });

    const drivers = useSelector((s) => s.users?.drivers || []);

    const driverOptions = useMemo(() => {
        return drivers.map((d) => ({
            value: d._id,
            label: `${d.first_name} ${d.last_name}`,
        }));
    }, [drivers]);

    useEffect(() => {
        if (uiModalOpen) {
            dispatch(fetchDrivers());
        }
    }, [uiModalOpen, dispatch]);

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                from: initialData.from || "",
                to: initialData.to || "",
                driver: initialData.driver
                    ? typeof initialData.driver === "object"
                        ? {
                            value: initialData.driver._id || initialData.driver.id,
                            label: `${initialData.driver.first_name || ""} ${initialData.driver.last_name || ""}`.trim(),
                        }
                        : driverOptions.find((d) => d.value === initialData.driver)
                    : null,
                status: initialData.status || "planned",
                startDate: initialData.startDate ? initialData.startDate.split("T")[0] : "",
                endDate: initialData.endDate ? initialData.endDate.split("T")[0] : "",
                notes: initialData.notes || "",
            });
        }
    }, [mode, initialData, driverOptions]);

    useEffect(() => {
        if (!uiModalOpen)
            setFormData({
                from: "",
                to: "",
                driver: null,
                status: "planned",
                startDate: "",
                endDate: "",
            });
    }, [uiModalOpen]);

    const modalOpen = typeof open === "boolean" ? open : uiModalOpen;
    const closeModal = onClose ? onClose : () => dispatch(setModalOpen(false));
    if (!modalOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            from: formData.from,
            to: formData.to,
            driver: formData.driver?.value || formData.driver || null,
            notes: formData.notes || undefined,
            status: formData.status || undefined,
            startDate: formData.startDate || undefined,
            endDate: formData.endDate || undefined,
        };
        try {
            if (onSubmit) await onSubmit(payload);
            closeModal();
        } catch (err) {
            console.error("Trip submit failed", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                onClick={closeModal}
            />
            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                        {mode === "edit" ? "Edit Trip" : "Create Trip"}
                    </h3>
                    <button type="button" onClick={closeModal}>
                        <X />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        className="w-full"
                        label="From"
                        name="from"
                        value={formData.from}
                        onChange={handleChange}
                        placeholder="Start location"
                    />
                    <Input
                        className="w-full"
                        label="To"
                        name="to"
                        value={formData.to}
                        onChange={handleChange}
                        placeholder="Destination"
                    />
                    <CustomSelect
                        label="Driver"
                        options={driverOptions}
                        value={formData.driver}
                        onChange={(opt) => setFormData((p) => ({ ...p, driver: opt }))}
                    />
                    {/* Truck selection removed per requirement; truck will be assigned separately */}
                    <Input
                        className="w-full"
                        label="Start Date"
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                    />
                    <Input
                        className="w-full"
                        label="End Date"
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                    />
                    <CustomSelect
                        label="Status"
                        options={[
                            { value: "planned", label: "Planned" },
                            { value: "started", label: "Started" },
                            { value: "stopped", label: "Stopped" },
                            { value: "completed", label: "Completed" },
                        ]}
                        value={
                            formData.status
                                ? { value: formData.status, label: formData.status }
                                : null
                        }
                        onChange={(opt) =>
                            setFormData((p) => ({ ...p, status: opt?.value }))
                        }
                    />
                </div>

                <div className="mt-4">
                    <Textarea label="Notes" name="notes" value={formData.notes} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes about the trip" />
                </div>

                <div className="mt-6 flex justify-end">
                    <PrimaryButton
                        title={mode === "edit" ? "Update Trip" : "Create Trip"}
                        type="submit"
                    />
                </div>
            </form>
        </div>
    );
};

export default TripModal;
