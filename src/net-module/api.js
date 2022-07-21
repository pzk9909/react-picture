import axios from "axios";
const axiosInstance = axios.create({
  // baseURL: 'http://101.200.234.17:80'
  baseURL: 'http://localhost:3033/'
})

export async function login(form) {
  let result = await axiosInstance.post('/users/login', form)
  return result.data
}

export async function upload(form,configs) {
  let result = await axiosInstance.post('/picture/upload', form, configs)
  return result.data.data
}

export async function getPicture(form) {
  let result = await axiosInstance.post('/picture/getPicture', form)
  return result.data.data
}

export async function acceptPicture(form) {
  let result = await axiosInstance.post('/picture/acceptPicture', form)
  return result.data.data
}

export async function rejectPicture(form) {
  let result = await axiosInstance.post('/picture/rejectPicture', form)
  return result.data.data
}

export async function deletePicture(form) {
  let result = await axiosInstance.post('/picture/deletePicture', form)
  return result.data.data
}

export async function goTopPicture(form) {
  let result = await axiosInstance.post('/picture/goTopPicture', form)
  return result.data.data
}

export async function sortPicture(form) {
  let result = await axiosInstance.post('/picture/sortPicture', form)
  return result.data.data
}