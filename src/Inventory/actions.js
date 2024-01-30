import axios from 'axios';
import {
  GridRowModes,
  GridRowEditStopReasons
} from '@mui/x-data-grid';

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

const processRowDelete = async (id, user, rows, setRows, setLoading) => {
  if (!user) { return; }
  try {
    await axios.delete('http://localhost:8000/inventory',
    {
      params: { id },
      headers: { 'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.accessToken }
    });
    console.log('delete succeeded');
  } catch (error) {
    console.error(error.message);
  }
  setLoading(false);
  setRows(rows.filter((row) => row.id !== id));
};

export const processRowUpdate = async (newRow, user, rows, setRows, setLoading) => {
  if (!user) { return; }
  setLoading(true);

  if (newRow.isNew) {
    try {
      await axios.post('http://localhost:8000/inventory',
      {
        id: newRow.id,
        name: newRow.name,
        expiration: newRow.expiration,
        user_id: user.uid,
        user_name: user.displayName,
        email: user.email
      },
      {
        headers: { 'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.accessToken }
      });
      console.log('post succeeded');
    } catch (error) {
      console.error(error.message);
    }
    setLoading(false);
    const updatedRow = {
        ...newRow,
        createdBy: newRow.isNew ? user.email : newRow.createdBy,
        daysLeft: Math.round((new Date(newRow.expiration) - new Date()) / (1000 * 60 * 60 * 24)),
        isNew: false
      };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;

  } else {
    try {
      await axios.patch('http://localhost:8000/inventory',
        {
          id: newRow.id,
          name: newRow.name,
          expiration: newRow.expiration
        },
        {
          headers: { 'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + user.accessToken }
        });
        console.log('patch succeeded');
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
      
      const updatedRow = {
        ...newRow,
        createdBy: newRow.isNew ? user.email : newRow.createdBy,
        daysLeft: Math.round((new Date(newRow.expiration) - new Date()) / (1000 * 60 * 60 * 24)),
        isNew: false
      };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
  }
};

export const fetchInventory = async (user, setLoading, setRows) =>{
  if (!user) {
    setLoading(true);
    setRows([]);
    return;
  }
  setLoading(true);
  try {
    const {data: response} = await axios.get('http://localhost:8000/inventories', {
      headers: { 'Content-Type': 'application/json',
                 'Authorization': 'Bearer ' + user.accessToken }
    });
    console.log('response', JSON.parse(response))
    const responseToRows = JSON.parse(response).map((item) => ({
      id: item.id,
      name: item.name,
      expiration: item.expiration ? new Date(item.expiration) : null,
      daysLeft: item.expiration ? Math.round((new Date(item.expiration) - new Date()) / (1000 * 60 * 60 * 24)) : null,
      createdBy: item.email,
      isNew: false,
    }));
    setRows(responseToRows);
  } catch (error) {
    console.error(error.message);
  }
  setLoading(false);
};