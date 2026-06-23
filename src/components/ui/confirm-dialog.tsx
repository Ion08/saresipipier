"use client";

import { Dialog, type DialogProps } from "./dialog";
import { Button } from "./button";

export interface ConfirmDialogProps
  extends Omit<DialogProps, "children" | "size"> {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  loading = false,
  onConfirm,
  onCancel,
  onClose,
  ...props
}: ConfirmDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <Dialog title={title} description={description} onClose={onClose} {...props}>
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="ghost"
          size="md"
          onClick={handleCancel}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={confirmVariant}
          size="md"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
