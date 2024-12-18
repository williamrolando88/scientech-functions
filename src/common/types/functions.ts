import { ParamsOf } from 'firebase-functions/core';
import {
  Change,
  DocumentSnapshot,
  FirestoreEvent,
} from 'firebase-functions/v2/firestore';

export type EventHandlerFunction = (
  event: FirestoreEvent<Change<DocumentSnapshot> | undefined, ParamsOf<string>>
) => any | Promise<any>;
