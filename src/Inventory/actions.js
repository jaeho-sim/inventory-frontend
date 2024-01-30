import axios from 'axios';
import {
  GridRowModes,
  GridRowEditStopReasons
} from '@mui/x-data-grid';
import { getInventory, createInventory, updateInventory, deleteInventory } from '../network';

export const handleRowEditStop = (params, event) => {
  if (params.reason === GridRowEditStopReasons.rowFocusOut) {
    event.defaultMuiPrevented = true;
  }
};

export const handleEditClick = (id, rowModesModel, setRowModesModel) => () => {
  setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
};

export const handleSaveClick = (id, rowModesModel, setRowModesModel) => () => {
  setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
};

export const handleDeleteClick = (id, user, rows, setRows, setLoading) => async () => {
  await processRowDelete(id, user, rows, setRows, setLoading);
};

export const handleCancelClick = (id, rows, setRows, rowModesModel, setRowModesModel) => () => {
  setRowModesModel({
    ...rowModesModel,
    [id]: { mode: GridRowModes.View, ignoreModifications: true },
  });

  const editedRow = rows.find((row) => row.id === id);
  if (editedRow.isNew) {
    setRows(rows.filter((row) => row.id !== id));
  }
};

export const fetchInventory = async (user, setLoading, setRows) =>{
  setLoading(true);
  if (!user) {
    setRows([]);
    return;
  }
  const response = await getInventory(user);
  setRows(response);
  setLoading(false);
};

export const processRowUpdate = async (newRow, user, rows, setRows, setLoading) => {
  if (!user) { return; }
  setLoading(true);

  if (newRow.isNew) {
    await createInventory(newRow, user);
  } else {
    await updateInventory(newRow, user);
  }

  const updatedRow = {
    ...newRow,
    createdBy: newRow.isNew ? user.email : newRow.createdBy,
    daysLeft: Math.round((new Date(newRow.expiration) - new Date()) / (1000 * 60 * 60 * 24)),
    isNew: false
  };
  setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
  setLoading(false);
  return updatedRow;
};


const processRowDelete = async (id, user, rows, setRows, setLoading) => {
  if (!user) { return; }
  setLoading(true);
  
  await deleteInventory(id, user);
  setLoading(false);
  setRows(rows.filter((row) => row.id !== id));
};

