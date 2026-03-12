import React from 'react';
import { CashierModal } from './CashierModal';
import { ConfirmationModal } from './ConfirmationModal';
import { OrderDetailsModal } from './OrderDetailsModal';

export const GeneralModals = () => {
  return (
    <>
      <CashierModal />
      <ConfirmationModal />
      <OrderDetailsModal />
    </>
  );
};
