import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useOS } from '../store/useOS';
import { useTranslation } from "@/lib/i18n";

const PopupApp: React.FC<{ windowId: string }> = ({ windowId }) => {
    const { closeWindow, systemState } = useOS();
    const t = useTranslation(systemState.language);
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(true);

    const handleCancel = () => {
        setInputValue('');
        setIsOpen(false);
        closeWindow(windowId);
    };

    const handleConfirm = () => {
        console.log('Saved content:', inputValue);
        // You could also save this to a global state or localStorage here
        setIsOpen(false);
        closeWindow(windowId);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <p className="text-muted-foreground mb-4 font-medium">{t.popup.running}</p>

            <Dialog open={isOpen} onOpenChange={(open) => {
                if (!open) handleCancel();
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t.popup.title}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                {t.popup.label}
                            </label>
                            <Input
                                id="name"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={t.popup.placeholder}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancel}>
                            {t.popup.cancel}
                        </Button>
                        <Button type="submit" onClick={handleConfirm}>
                            {t.popup.confirm}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Button variant="ghost" onClick={() => setIsOpen(true)}>
                {t.popup.reopen}
            </Button>
        </div>
    );
};

export default PopupApp;
