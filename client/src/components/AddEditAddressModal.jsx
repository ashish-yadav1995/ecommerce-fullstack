import React from "react";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
// import { updateAddress } from "../services/authApi";


const AddEditAddressModal = ({ isOpen, onClose, selectedAddressId, isEditMode = false }) => {
    const { addresses, handleUpdateAddress, handleAddNewAddress, handleDeleteAddress, handleSetDefaultAddress, setLoading } = useAuth();
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
    });



    const handleForm = async (addressData) => {
        try {
            setLoading(true);
            let addressId = selectedAddressId;

            if (addressId) {
                const addressResponse = await handleUpdateAddress(addressId, addressData);
                console.log("addressResponse", addressResponse)       
                 // addressId = addressResponse?._id || addressResponse?.address?._id || addressResponse?.data?._id;
            }else{
                const response = await handleAddNewAddress(addressData)
                console.log("response from handleForm function in addeditaddressmodal",response)
            }

            onClose()
        } catch (error) {
            console.error("Checkout process error:", error);
            alert(
                error.response?.data?.message || "Checkout failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (isOpen) {
            if (isEditMode && selectedAddressId) {
                const foundAddress = addresses?.find((a) => a._id === selectedAddressId);
                if (foundAddress) {
                    reset({
                        fullName: foundAddress.fullName || "",
                        mobile: foundAddress.mobile || "",
                        addressLine1: foundAddress.addressLine1 || "",
                        addressLine2: foundAddress.addressLine2 || "",
                        landmark: foundAddress.landmark || "",
                        city: foundAddress.city || "",
                        state: foundAddress.state || "",
                        postalCode: foundAddress.postalCode || "",
                        country: foundAddress.country || "India",
                        addressType: foundAddress.addressType || "Home",
                        isDefault: foundAddress.isDefault || false,
                    });
                }
            } else {
                reset({
                    fullName: "",
                    mobile: "",
                    addressLine1: "",
                    addressLine2: "",
                    landmark: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    country: "India",
                    addressType: "Home",
                    isDefault: false,
                });
            }
        }
    }, [isOpen, isEditMode, selectedAddressId, addresses, reset]);

    console.log("AddEditAddressModal.jsx", isEditMode,)
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 md:p-10 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">

                {/* HEADER */}
                <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter text-black uppercase italic">
                            {isEditMode ? "Edit Address" : "Add New Address"}
                        </h3>
                        <p className="text-gray-400 text-[11px] mt-1 font-bold uppercase tracking-widest">
                            Enter delivery contact and location details
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-all text-lg font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* FORM FIELDS */}
                <form className="space-y-5" onSubmit={handleSubmit(handleForm)}>
                    <div className="mt-8 space-y-6">

                        {/* ADDRESS TYPE TAGS */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em]">
                                Address Type
                            </label>
                            <div className="flex gap-3">
                                {["Home", "Work", "Other"].map((type, idx) => (
                                    <button
                                        key={type}
                                        type="button"
                                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${idx === 0
                                            ? "bg-black text-white shadow-md"
                                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* RECEIVER DETAILS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em]">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Receiver's Name"
                                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl text-[14px] font-bold focus:bg-white focus:border-black/20 outline-none transition-all shadow-inner"
                                    {...register("fullName", {
                                        required: "Full name is required",
                                        pattern: {
                                            value: /^[A-Za-z\s]+$/,
                                            message: "Only letters allowed",
                                        },
                                    })}
                                />

                                {errors.fullName && (
                                    <p className="text-red-500 text-[10px] font-bold mt-1">
                                        {errors.fullName.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em]">
                                    Mobile Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="10-digit mobile number"
                                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl text-[14px] font-bold focus:bg-white focus:border-black/20 outline-none transition-all shadow-inner"
                                    {...register("mobile", {
                                        required: "Mobile number is required",
                                        pattern: {
                                            value: /^[6-9][0-9]{9}$/,
                                            message: "Enter valid 10 digit mobile number",
                                        },
                                    })}
                                />

                                {errors.mobile && (
                                    <p className="text-red-500 text-[10px] font-bold mt-1">
                                        {errors.mobile.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* STREET ADDRESS */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em]">
                                Address Line 1
                            </label>
                            <input
                                type="text"
                                placeholder="Flat, House no., Building, Company, Apartment"
                                className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl text-[14px] font-bold focus:bg-white focus:border-black/20 outline-none transition-all shadow-inner"
                                {...register("addressLine1", {
                                    required: "Address is required",
                                    minLength: {
                                        value: 5,
                                        message: "Please enter complete address",
                                    },
                                })}
                            />

                            {errors.addressLine1 && (
                                <p className="text-red-500 text-[10px] font-bold mt-1">
                                    {errors.addressLine1.message}
                                </p>
                            )}

                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em]">
                                Address Line 2 (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="Area, Street, Sector, Village"
                                className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl text-[14px] font-bold focus:bg-white focus:border-black/20 outline-none transition-all shadow-inner"
                                {...register("addressLine2")}

                            />
                        </div>

                        {/* LANDMARK & CITY */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em]">
                                    Landmark
                                </label>
                                <input
                                    type="text"
                                    placeholder="E.g. Near Axis Bank ATM"
                                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl text-[14px] font-bold focus:bg-white focus:border-black/20 outline-none transition-all shadow-inner"
                                    {...register("landmark")}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em]">
                                    City
                                </label>
                                <input
                                    type="text"
                                    placeholder="City / Town"
                                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl text-[14px] font-bold focus:bg-white focus:border-black/20 outline-none transition-all shadow-inner"
                                    {...register("city", {
                                        required: "City is required",
                                    })}
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-[10px] font-bold mt-1">
                                        {errors.city.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* STATE & PINCODE */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em]">
                                    State
                                </label>
                                <input
                                    type="text"
                                    placeholder="State"
                                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl text-[14px] font-bold focus:bg-white focus:border-black/20 outline-none transition-all shadow-inner"
                                    {...register("state", {
                                        required: "State is required",
                                    })}
                                />
                                {errors.state && (
                                    <p className="text-red-500 text-[10px] font-bold mt-1">
                                        {errors.state.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em]">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    placeholder="6-digit Pincode"
                                    className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-2xl text-[14px] font-bold focus:bg-white focus:border-black/20 outline-none transition-all shadow-inner"
                                    {...register("postalCode", {
                                        required: "Postal code is required",
                                        pattern: {
                                            value: /^[0-9]{6}$/,
                                            message: "Postal code must be 6 digits",
                                        },
                                    })}
                                />
                                {errors.postalCode && (
                                    <p className="text-red-500 text-[10px] font-bold mt-1">
                                        {errors.postalCode.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* SET AS DEFAULT CHECKBOX */}
                        <div className="flex items-center gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                className="w-5 h-5 rounded-lg accent-black cursor-pointer"
                                {...register("isDefault")}

                            />
                            <label
                                htmlFor="isDefault"
                                className="text-xs font-bold text-gray-700 cursor-pointer select-none"
                            >
                                Make this my default delivery address
                            </label>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-4 pt-6 border-t border-gray-100">
                            <button
                                type="submit"
                                className="flex-1 bg-black text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
                            >
                                {isEditMode ? "Update Address" : "Save Address"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gray-200 hover:text-black transition-all"
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditAddressModal;