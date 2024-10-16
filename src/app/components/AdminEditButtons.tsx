import AdminServerComponent from "@app/providers/AdminServerComponents";
import React from "react";
import UpdateButton from "./UpdateButton";
import DeleteButton from "./DeleteButton";
import AddLatLon from "./AddLatLon";
import { iFlohmarkt, iPost, iSessionUser, iSpielplatz } from "@app/utils/types";
import RestoreButton from "./RestoreButton";
import ApproveButton from "./ApproveButton";
import Button from "./Button";

interface iAdminEditButtons {
  updateButton?: {
    type: "flohmarkt" | "post" | "spielplatz";
    size: "small" | "medium" | "large";
    link: string;
    status: "approved" | "rejected" | "pending" | "old";
  };
  deleteButton?: {
    id: number;
    type: "flohmarkt" | "post" | "spielplatz";
    title: string;
    deleteFrom: "suggested" | "approved" | "all";
    size?: "small" | "medium" | "large";
    callbackURL?: string;
  };
  addLatLonButton?: {
    item: iFlohmarkt | iSpielplatz | iPost;
  };
  copyButton?: {
    type: "flohmarkt" | "post" | "spielplatz";
    id: number;
  };
  restoreButton?: {
    flohmarktID?: string | number;
    spielplatzID?: string | number;
    postID?: string | number;
    size?: "small" | "medium" | "large";
  };
  approveButton?: {
    redirect?: boolean;
    post?: iPost;
    flohmarktID?: string;
    spielplatzID?: string;
    contributor?: iSessionUser;
    size?: "small" | "medium" | "large";
  };
  children?: React.ReactNode;
}
export default function AdminEditButtons({
  updateButton,
  deleteButton,
  addLatLonButton,
  restoreButton,
  copyButton,
  approveButton,
  children,
}: iAdminEditButtons) {
  return (
    <AdminServerComponent>
      <aside
        id="admin-edit-buttons"
        className="flex gap-2 flex-wrap items-center justify-center mb-4"
      >
        {approveButton && (
          <ApproveButton
            post={approveButton.post}
            flohmarktID={approveButton.flohmarktID}
            spielplatzID={approveButton.spielplatzID}
            contributor={approveButton.contributor}
            size={approveButton.size}
            redirect={approveButton.redirect}
          />
        )}
        {restoreButton && (
          <RestoreButton
            flohmarktID={restoreButton.flohmarktID}
            spielplatzID={restoreButton.spielplatzID}
            postID={restoreButton.postID}
            size="medium"
          />
        )}
        {updateButton && (
          <UpdateButton
            size={updateButton.size}
            link={updateButton.link}
            status={updateButton.status || "pending"}
            type={updateButton.type}
          />
        )}
        {deleteButton && (
          <DeleteButton
            id={deleteButton.id}
            type={deleteButton.type}
            title={deleteButton.title}
            deleteFrom={deleteButton.deleteFrom}
            size={deleteButton.size}
            callbackURL={deleteButton.callbackURL}
          />
        )}
        {addLatLonButton && <AddLatLon item={addLatLonButton.item} />}
        {copyButton && (
          <Button
            href={`/copy-${copyButton.type}/${copyButton.id}`}
            variant="hh-dark"
            size="fit"
            fontWeight="semibold"
          >
            <>
              Copy <span className="capitalize">{copyButton.type}</span>
            </>
          </Button>
        )}
        {children}
      </aside>
    </AdminServerComponent>
  );
}
