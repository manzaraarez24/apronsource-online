import { useState, useEffect, useCallback } from "react";

export interface Address {
    id: string;
    label: string;         // e.g. "Home", "Office", "Warehouse"
    fullName: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}

const ADDRESSES_STORAGE_KEY = "zarrks_saved_addresses";

const loadAddresses = (): Address[] => {
    try {
        const stored = localStorage.getItem(ADDRESSES_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const persistAddresses = (addresses: Address[]) => {
    try {
        localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(addresses));
    } catch {
        // localStorage full or unavailable
    }
};

export const useAddresses = () => {
    const [addresses, setAddresses] = useState<Address[]>(loadAddresses);

    useEffect(() => {
        persistAddresses(addresses);
    }, [addresses]);

    const addAddress = useCallback((address: Omit<Address, "id">) => {
        const newAddr: Address = {
            ...address,
            id: `addr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        };

        setAddresses((prev) => {
            // If this is the first address or marked as default, ensure only one default
            if (newAddr.isDefault || prev.length === 0) {
                newAddr.isDefault = true;
                return [...prev.map((a) => ({ ...a, isDefault: false })), newAddr];
            }
            return [...prev, newAddr];
        });

        return newAddr.id;
    }, []);

    const updateAddress = useCallback((id: string, updates: Partial<Omit<Address, "id">>) => {
        setAddresses((prev) => {
            let updated = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
            // If setting as default, unset all others
            if (updates.isDefault) {
                updated = updated.map((a) => ({ ...a, isDefault: a.id === id }));
            }
            return updated;
        });
    }, []);

    const deleteAddress = useCallback((id: string) => {
        setAddresses((prev) => {
            const filtered = prev.filter((a) => a.id !== id);
            // If we deleted the default, make the first one default
            if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
                filtered[0].isDefault = true;
            }
            return filtered;
        });
    }, []);

    const setDefaultAddress = useCallback((id: string) => {
        setAddresses((prev) =>
            prev.map((a) => ({ ...a, isDefault: a.id === id }))
        );
    }, []);

    const getDefaultAddress = useCallback((): Address | undefined => {
        return addresses.find((a) => a.isDefault) || addresses[0];
    }, [addresses]);

    return {
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress,
    };
};

// Indian states for the dropdown
export const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];
