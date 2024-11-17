import React, { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import api from "../api/api";
import Folder from "./folder";
import File from "./file";
import "../App.css"; // Ensure the CSS file is imported

function FileExplorer() {
  const [directory, setDirectory] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(true);
  const [parentFolderId, setParentFolderId] = useState(null);
  const [showInput, setShowInput] = useState(false);

  const fetchDirectory = async () => {
    try {
      const response = await api.getFiles();
      setDirectory(response.data);
    } catch (error) {
      console.error("Error fetching directory:", error);
    }
  };

  useEffect(() => {
    fetchDirectory();
  }, []);

  const handleCreateItem = async () => {
    if (!newItemName.trim()) return;
    try {
      const type = isCreatingFolder ? "folder" : "file";
      await api.createFile({
        name: newItemName,
        type,
        parentId: parentFolderId,
      });
      setNewItemName("");
      setParentFolderId(null);
      setShowInput(false);
      fetchDirectory();
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  return (
    <DndContext>
      <div className="FileExplorer">
        <header>
          <h1>File Explorer</h1>
          <div className="button-group">
            <button
              onClick={() => {
                setIsCreatingFolder(true);
                setParentFolderId(null);
                setShowInput(true);
              }}
            >
              New Folder
            </button>
            <button
              onClick={() => {
                setIsCreatingFolder(false);
                setParentFolderId(null);
                setShowInput(true);
              }}
            >
              New File
            </button>
          </div>
        </header>

        {showInput && (
          <div className="input-container">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={
                isCreatingFolder ? "Enter folder name" : "Enter file name"
              }
            />
            <button onClick={handleCreateItem}>Create</button>
            <button
              className="button-cancel"
              onClick={() => setShowInput(false)}
            >
              Cancel
            </button>
          </div>
        )}

        <main className="directory-list">
          {directory ? (
            directory.map((item) => {
              if (item.type === "folder") {
                return (
                  <Folder
                    key={item._id}
                    folder={item}
                    onRefresh={fetchDirectory}
                    onCreateItem={setParentFolderId}
                    setShowInput={setShowInput}
                    setNewItemName={setNewItemName}
                    setIsCreatingFolder={setIsCreatingFolder}
                  />
                );
              } else if (item.type === "file") {
                return (
                  <File
                    key={item._id}
                    file={item}
                    onRefresh={fetchDirectory}
                  />
                );
              }
              return null;
            })
          ) : (
            <p className="loading">Loading directory...</p>
          )}
        </main>
      </div>
    </DndContext>
  );
}

export default FileExplorer;
