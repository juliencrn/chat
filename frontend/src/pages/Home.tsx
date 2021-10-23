import React from "react";

import ThreadList from "../components/Chat/ThreadList";
import Layout from "../components/Layout";
import { ProtectedRouteProps } from "../Router";

export default function Home(props: ProtectedRouteProps) {
  return (
    <Layout center={true}>
      <h3>Hello {props.user.username}</h3>
      <ThreadList />
    </Layout>
  );
}
