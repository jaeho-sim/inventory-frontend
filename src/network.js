import axios from 'axios';

export const getInventory = async (user) => {
  try {
    const {data: response} = await axios.get('http://localhost:8000/inventories', headerConfig(user.accessToken));

    const parsedResponse = JSON.parse(response);
    console.log('response', parsedResponse);
    const responseToRows = parsedResponse.map((item) => ({
      id: item.id,
      name: item.name,
      expiration: item.expiration ? new Date(item.expiration) : null,
      daysLeft: item.expiration ? Math.round((new Date(item.expiration) - new Date()) / (1000 * 60 * 60 * 24)) : null,
      createdBy: item.email,
      isNew: false,
    }));
    return responseToRows;

  } catch (error) {
    console.error(error.message);
  }
};

export const createInventory = async (newRow, user) => {
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
      headerConfig(user.accessToken)
    );
    console.log('post succeeded');
  } catch (error) {
    console.error(error.message);
  }
};

export const updateInventory = async (newRow, user) => {
  try {
    await axios.patch('http://localhost:8000/inventory',
      {
        id: newRow.id,
        name: newRow.name,
        expiration: newRow.expiration
      },
      headerConfig(user.accessToken)
    );
      console.log('patch succeeded');
  } catch (error) {
    console.error(error.message);
  }
};

export const deleteInventory = async (id, user) => {
  try {
    await axios.delete('http://localhost:8000/inventory',
    {
      params: { id },
      ...headerConfig(user.accessToken)
    });
    console.log('delete succeeded');
  } catch (error) {
    console.error(error.message);
  }
};

const headerConfig = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  }
});
