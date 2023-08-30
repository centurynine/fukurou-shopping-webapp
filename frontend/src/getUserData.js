import axios from 'axios';

const getUserData = async (token) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/api/getuserdata`, {
      headers: {
        'x-access-token': `${token}`
      }
    });
    return response.data;
 
  } catch (error) {
    throw error;
  }
};

export default getUserData;