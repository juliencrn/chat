import React from "react";

import { useSelector } from "react-redux";

import { modalSelector } from "../state/slices/modalSlice";
import Modal from "./Modal/Modal";
import Toaster from "./Toaster";

interface LayoutProps {
  children: React.ReactNode;
  center?: boolean;
  card?: boolean;
  pageTitle?: string;
}

function Layout({ children, center, card, pageTitle }: LayoutProps) {
  const modal = useSelector(modalSelector);

  const Children = (
    <>
      {!!modal.type && <Modal {...modal} />}
      <Toaster />
      {children}
    </>
  );

  return center ? (
    <Center>
      {card ? <Card title={pageTitle}>{Children}</Card> : Children}
    </Center>
  ) : (
    <div className="fixed top-0 left-0 h-full w-full flex">{Children}</div>
  );
}

export default Layout;

function Center(props: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full fixed flex top-0 left-0 bg-gray-100">
      <div className="w-full max-w-sm p-4 m-auto relative">
        {props.children}
      </div>
    </div>
  );
}

interface CardLayoutProps {
  title?: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardLayoutProps) {
  return (
    <>
      {title && (
        <h2 className="font-bold text-xl tracking-wide mb-2 text-center">
          {title}
        </h2>
      )}

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {children}
      </div>
    </>
  );
}
