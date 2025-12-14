// Single, cleaned TireModal component (no duplicates)
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Input from "../UI/Input";
import PrimaryButton from "../UI/PrimaryButton";
import CustomSelect from "../UI/CustomSelect";
import { useDispatch, useSelector } from "react-redux";
import api from "../../tools/axios";
import { fetchVehicles } from "../../store/vehicle/vehicleSlice";
import { setModalOpen } from "../../store/ui/modalSlice";
import ImageUpload from "../UI/ImageUpload";

const TireModal = ({
    open,
    onClose,
    mode = "add",
    initialData = null,
    onSubmit,
}) => {
    const dispatch = useDispatch();
    const uiModalOpen = useSelector((s) => s.modal?.modalOpen);

    const [formData, setFormData] = useState({
        serialNumber: "",
        brand: "",
        model: "",
        size: "",
        position: "",
        status: "New",
        installedOn: null,
        usedMileage: "",
        image: "",
    });

    const vehiclesState = useSelector((s) => s.vehicles?.vehicles || []);
    const vehicleOptions = vehiclesState.map((v) => ({
        value: v._id,
        label: `${v.brand} ${v.model}`,
    }));
    const positionOptions = [
        { value: 'front-left', label: 'Front Left' },
        { value: 'front-right', label: 'Front Right' },
        { value: 'rear-left', label: 'Rear Left' },
        { value: 'rear-right', label: 'Rear Right' },
    ];

    useEffect(() => {
        if (mode === "edit") dispatch(fetchVehicles());
    }, [mode, dispatch]);

    useEffect(() => {
        if (mode === "edit" && initialData) {
            const installedOpt =
                initialData.installedOn && typeof initialData.installedOn === "object"
                    ? {
                        value: initialData.installedOn._id || initialData.installedOn.id,
                        label: `${initialData.installedOn.brand || ""} ${initialData.installedOn.model || ""
                            }`.trim(),
                    }
                    : vehiclesState.find((v) => v._id === initialData.installedOn)
                        ? {
                            value: initialData.installedOn,
                            label:
                                vehiclesState.find((v) => v._id === initialData.installedOn)
                                    .brand +
                                " " +
                                vehiclesState.find((v) => v._id === initialData.installedOn)
                                    .model,
                        }
                        : null;

            setFormData({
                serialNumber: initialData.serialNumber || "",
                brand: initialData.brand || "",
                model: initialData.model || "",
                size: initialData.size || "",
                position: initialData.position || "",
                status: initialData.status || "New",
                installedOn: installedOpt,
                usedMileage: initialData.usedMileage ?? "",
                image: initialData.image
                    ? initialData.image.startsWith("/")
                        ? api.defaults.baseURL.replace("/api/v1", "") + initialData.image
                        : initialData.image
                    : "",
            });
        }
    }, [mode, initialData, vehiclesState]);

    useEffect(() => {
        if (!uiModalOpen)
            setFormData({
                serialNumber: "",
                brand: "",
                model: "",
                size: "",
                position: "",
                status: "New",
                installedOn: null,
                usedMileage: "",
                image: "",
            });
    }, [uiModalOpen]);

    const modalOpen = typeof open === "boolean" ? open : uiModalOpen;
    const closeModal = onClose ? onClose : () => dispatch(setModalOpen(false));
    if (!modalOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };
    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value === "" ? "" : Number(value) }));
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFormData((p) => ({
            ...p,
            image: URL.createObjectURL(file),
            imageFile: file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("serialNumber", formData.serialNumber || "");
        fd.append("brand", formData.brand || "");
        fd.append("model", formData.model || "");
        fd.append("size", formData.size || "");
        if (formData.position) fd.append("position", formData.position);
        if (mode === "edit") {
            if (formData.status) fd.append("status", formData.status);
            if (formData.installedOn?.value)
                fd.append("installedOn", formData.installedOn.value);
        }
        if (formData.usedMileage !== "") fd.append("usedMileage", formData.usedMileage);
        if (formData.imageFile) fd.append("image", formData.imageFile);
        try {
            if (onSubmit) await onSubmit(fd);
            closeModal();
        } catch (err) {
            console.error("Tire submission failed", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                onClick={closeModal}
            />
            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                encType="multipart/form-data"
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {mode === "edit" ? "Edit Tire" : "Add Tire"}
                    </h2>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                            Tire Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                className="w-full"
                                label="Serial Number"
                                name="serialNumber"
                                value={formData.serialNumber}
                                placeholder="e.g. SN123456"
                                onChange={handleChange}
                            />
                            <Input
                                className="w-full"
                                label="Brand"
                                name="brand"
                                value={formData.brand}
                                placeholder="e.g. Michelin"
                                onChange={handleChange}
                            />
                            <Input
                                className="w-full"
                                label="Model"
                                name="model"
                                value={formData.model}
                                placeholder="e.g. Pilot Sport 4"
                                onChange={handleChange}
                            />
                            <Input
                                className="w-full"
                                label="Size"
                                name="size"
                                value={formData.size}
                                placeholder="e.g. 205/55R16"
                                onChange={handleChange}
                            />
                            {mode === "edit" && (
                                <CustomSelect
                                    label="Installed On"
                                    options={vehicleOptions}
                                    value={formData.installedOn}
                                    onChange={(opt) =>
                                        setFormData((p) => ({ ...p, installedOn: opt }))
                                    }
                                />
                            )}
                            <CustomSelect
                                label="Position"
                                options={positionOptions}
                                value={
                                    formData.position
                                        ? positionOptions.find((o) => o.value === formData.position)
                                        : null
                                }
                                onChange={(opt) => setFormData((p) => ({ ...p, position: opt?.value }))}
                            />
                            <Input
                                className="w-full"
                                label="Used Mileage"
                                name="usedMileage"
                                type="number"
                                value={formData.usedMileage}
                                placeholder="e.g. 12000"
                                onChange={handleNumberChange}
                            />
                            {mode === "edit" && (
                                <CustomSelect
                                    label="Status"
                                    options={[
                                        { value: "New", label: "New" },
                                        { value: "In-use", label: "In-use" },
                                        { value: "Maintenance", label: "Maintenance" },
                                        { value: "Retired", label: "Retired" },
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
                            )}
                        </div>
                    </div>
                    <div>
                        <ImageUpload label="Tire Image" value={formData.image} onFileChange={handleFileChange} mode={mode} />
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end">
                    <PrimaryButton
                        title={mode === "edit" ? "Update Tire" : "Add Tire"}
                        type="submit"
                    />
                </div>
            </form>
        </div>
    );
};

export default TireModal;
