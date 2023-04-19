/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const sendQuery = async (queryEmail, queryName, querySubject, queryMessage) => {
  console.log(queryMessage)
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/queries",
      data: {
        queryEmail,
        queryName,
        querySubject,
        queryMessage
      }
    });

    if (res.data.status === "success") {
      showAlert("success", "Queries sent successfully!");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

export const replyQuery = async (replyMessage, queryId) => {
  console.log(replyMessage);
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/queries/replyQuery",
      data: {
        replyMessage,
        queryId
      }
    });

    if (res.data.status === "success") {
      showAlert("success", "Reply sent successfully!");
      window.setTimeout(() => {
        location.assign('/queries');
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data);
    console.log(err.response.data);
  }
};

