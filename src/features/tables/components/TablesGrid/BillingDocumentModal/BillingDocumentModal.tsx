import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { Modal } from "../../../../../shared/components/Modal/Modal";
import type { OrderItem } from "../../../types/order.types";
import "./billing-document-modal.css";

type BillingType = "CONSUMIDOR_FINAL" | "FACTURA";

type InvoiceFormState = {
  fullName: string;
  email: string;
  idNumber: string;
  sector: string;
};

type BillingDocumentModalProps = {
  isOpen: boolean;
  tableNumber: number;
  createdAt: string;
  peopleCount: number;
  items: OrderItem[];
  total: number;
  onClose: () => void;
  onConfirmPayment: () => void;
};

const initialFormState: InvoiceFormState = {
  fullName: "",
  email: "",
  idNumber: "",
  sector: ""
};

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function BillingDocumentModal(props: BillingDocumentModalProps) {
  const {
    isOpen,
    tableNumber,
    createdAt,
    peopleCount,
    items,
    total,
    onClose,
    onConfirmPayment
  } = props;

  const [billingType, setBillingType] = useState<BillingType>("CONSUMIDOR_FINAL");
  const [form, setForm] = useState<InvoiceFormState>(initialFormState);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const canGenerate = useMemo(() => {
    if (items.length === 0) return false;

    if (billingType === "CONSUMIDOR_FINAL") return true;

    return (
      form.fullName.trim().length > 0 &&
      isValidEmail(form.email.trim()) &&
      form.idNumber.trim().length > 0 &&
      form.sector.trim().length > 0
    );
  }, [billingType, form, items.length]);

  const resetState = () => {
    setBillingType("CONSUMIDOR_FINAL");
    setForm(initialFormState);
    setErrorMessage("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFieldChange = (field: keyof InvoiceFormState, value: string) => {
    setErrorMessage("");
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const buildPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    let y = 52;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Restaurant POS", 40, y);

    y += 24;
    doc.setFontSize(12);
    doc.text(
      billingType === "CONSUMIDOR_FINAL" ? "Comprobante - Consumidor Final" : "Factura",
      40,
      y
    );

    y += 24;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(`Fecha: ${new Date(createdAt).toLocaleString()}`, 40, y);
    y += 16;
    doc.text(`Mesa: ${tableNumber}`, 40, y);
    y += 16;
    doc.text(`Personas: ${peopleCount}`, 40, y);

    y += 24;

    if (billingType === "CONSUMIDOR_FINAL") {
      doc.text("Cliente: Consumidor final", 40, y);
      y += 16;
      doc.text("Identificacion: 9999999999999", 40, y);
      y += 16;
      doc.text("Direccion: N/A", 40, y);
      y += 16;
      doc.text("Correo: N/A", 40, y);
    } else {
      doc.text(`Cliente: ${form.fullName}`, 40, y);
      y += 16;
      doc.text(`Cedula: ${form.idNumber}`, 40, y);
      y += 16;
      doc.text(`Sector: ${form.sector}`, 40, y);
      y += 16;
      doc.text(`Correo: ${form.email}`, 40, y);
    }

    y += 24;
    doc.setFont("helvetica", "bold");
    doc.text("Detalle", 40, y);

    y += 18;
    doc.setFont("helvetica", "normal");

    items.forEach((item) => {
      const line = `${item.name} | ${item.quantity} x ${formatCurrency(item.unitPrice)} = ${formatCurrency(
        item.quantity * item.unitPrice
      )}`;

      if (y > 760) {
        doc.addPage();
        y = 52;
      }

      doc.text(line, 40, y);
      y += 16;

      if (item.notes && item.notes.trim().length > 0) {
        doc.text(`Nota: ${item.notes}`, 52, y);
        y += 16;
      }
    });

    y += 14;
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${formatCurrency(total)}`, 40, y);

    const suffix = billingType === "CONSUMIDOR_FINAL" ? "consumidor-final" : "factura";
    const fileName = `mesa-${tableNumber}-${suffix}.pdf`;

    doc.save(fileName);
  };

  const handleGenerate = () => {
    if (items.length === 0) {
      setErrorMessage("Add at least one product before generating the document.");
      return;
    }

    if (billingType === "FACTURA") {
      if (
        form.fullName.trim().length === 0 ||
        form.idNumber.trim().length === 0 ||
        form.sector.trim().length === 0
      ) {
        setErrorMessage("Complete all required fields for invoice.");
        return;
      }

      if (!isValidEmail(form.email.trim())) {
        setErrorMessage("Enter a valid email address.");
        return;
      }
    }

    buildPdf();
    onConfirmPayment();
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} title="Facturación" onClose={handleClose}>
      <div className="billing-modal">
        <p className="billing-caption">
          Selecciona el tipo de documento para continuar con el pago.
        </p>

        <div className="billing-type-selector">
          <button
            type="button"
            className={billingType === "CONSUMIDOR_FINAL" ? "is-active" : ""}
            onClick={() => setBillingType("CONSUMIDOR_FINAL")}
          >
            Consumidor final
          </button>
          <button
            type="button"
            className={billingType === "FACTURA" ? "is-active" : ""}
            onClick={() => setBillingType("FACTURA")}
          >
            Factura
          </button>
        </div>

        {billingType === "CONSUMIDOR_FINAL" && (
          <div className="billing-preview">
            <h4>Datos del cliente</h4>
            <div className="billing-kv">
              <span>Cliente</span>
              <span>Consumidor final</span>
            </div>
            <div className="billing-kv">
              <span>Identificación</span>
              <span>9999999999999</span>
            </div>
            <div className="billing-kv">
              <span>Dirección</span>
              <span>N/A</span>
            </div>
            <div className="billing-kv">
              <span>Correo</span>
              <span>N/A</span>
            </div>
          </div>
        )}

        {billingType === "FACTURA" && (
          <div className="billing-form">
            <label>
              Nombres
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => handleFieldChange("fullName", e.target.value)}
                placeholder="Nombre completo"
              />
            </label>

            <label>
              Correo
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                placeholder="correo@dominio.com"
              />
            </label>

            <label>
              Cedula
              <input
                type="text"
                value={form.idNumber}
                onChange={(e) => handleFieldChange("idNumber", e.target.value)}
                placeholder="Numero de cedula"
              />
            </label>

            <label>
              Sector
              <input
                type="text"
                value={form.sector}
                onChange={(e) => handleFieldChange("sector", e.target.value)}
                placeholder="Sector"
              />
            </label>
          </div>
        )}

        {errorMessage && <p className="billing-error">{errorMessage}</p>}

        <div className="billing-modal-footer">
          <button type="button" onClick={handleClose}>Cancelar</button>
          <button type="button" onClick={handleGenerate} disabled={!canGenerate}>
            Generar PDF y pagar
          </button>
        </div>
      </div>
    </Modal>
  );
}
