import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "./store"

 const getBaseQuery = (basePath?: string) =>
fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_API_ENDPOINT}/${basePath}`,
  fetchFn: fetch,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken
    if (accessToken) {
      headers.set("Authorization", "Bearer " + accessToken)
    } 
    headers.set("Content-Type", "application/json")
    return headers
  },
})

export default getBaseQuery