import { ConnectorsStoreClass } from '/lib/connectors/connectors';
import { TransactionStateTrackerStoreClass } from '/lib/TransactionStateTracker';

export const ConnectorsStore = new ConnectorsStoreClass();

export const TransactionStateTrackerStore =
  new TransactionStateTrackerStoreClass();
