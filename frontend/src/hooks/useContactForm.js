import { useState } from "react";

const initialValues = {
    name: "",
    email: "",
    subject: "",
    message: ""
};

export function useContactForm() {
    const [values, setValues] = useState(initialValues);
    const [status, setStatus] = useState({ type: "idle", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateValue = (field, value) => {
        setValues((prev) => ({ ...prev, [field]: value }));
    };

    const submit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: "idle", message: "" });

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            });

            const data = await response.json();
            if (!response.ok) {
                setStatus({ type: "error", message: data.message || "Could not send your message." });
                return;
            }

            setValues(initialValues);
            setStatus({ type: "success", message: data.message || "Message sent successfully." });
        } catch {
            setStatus({ type: "error", message: "Contact service is unavailable right now." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        values,
        status,
        isSubmitting,
        updateValue,
        submit
    };
}
