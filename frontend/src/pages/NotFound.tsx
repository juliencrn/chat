import React from "react";

import { useLocation } from "react-router";

import Layout from "../components/Layout";

export default function NotFound() {
  const location = useLocation();
  return (
    <Layout center>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </Layout>
  );
}
