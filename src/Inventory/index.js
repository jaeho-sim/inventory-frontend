import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem
} from '@mui/x-data-grid';
import {
  randomId
} from '@mui/x-data-grid-generator';
import { AuthContext } from '../contexts';
import {
  handleRowEditStop,
  handleEditClick,
  handleSaveClick,
  handleDeleteClick,
  handleCancelClick,
  processRowUpdate,
  fetchInventory
} from './actions';

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '', daysLeft: '', createdBy: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

const Inventory = () => {
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const { user } = React.useContext(AuthContext);

  React.useEffect(() => {
    fetchInventory(user, setLoading, setRows);
  }, [user]);

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Item Name',
      width: 240,
      editable: true
    },
    {
      field: 'expiration',
      headerName: 'Expiry Date',
      type: 'date',
      width: 180,
      editable: true,
    },
    {
      field: 'daysLeft',
      headerName: 'Days Left',
      type: 'number',
      width: 140,
      align: 'left',
      headerAlign: 'left',
      editable: false,
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      width: 200,
      editable: false
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id, rowModesModel, setRowModesModel)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id, rows, setRows, rowModesModel, setRowModesModel)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id, rowModesModel, setRowModesModel)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id, user, rows, setRows, setLoading)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={(newRow) => processRowUpdate(newRow, user, rows, setRows, setLoading)}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        loading={loading}
      />
    </Box>
  );
};

export default Inventory;
