/* eslint-disable */
import axios from 'axios';
import catchAsync from "../../utils/catchAsync";
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