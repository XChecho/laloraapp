import React from 'react';
import { AlertModal } from './AlertModal';
import { CashierModal } from './CashierModal';
import { ConfirmationModal } from './ConfirmationModal';
import { OrderDetailsModal } from './OrderDetailsModal';

export const GeneralModals = () => {
  return (
    <>
      <AlertModal />
      <CashierModal />
      <ConfirmationModal />
      <OrderDetailsModal />
    </>
  );
};