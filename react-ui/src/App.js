import "./Styles/App.scss";
import { useEffect } from "react";
import AddFolder from "./components/AddFolder";
import Folder from "./components/Folder";
import Navbar from "./components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { selectLinks } from "./features/links/linkSlice";
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { store } from "./app/store";

import { reArrangeFolders } from "./features/links/linkSlice";

function App() {
  const links = useSelector(selectLinks);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "DumpStar.io";
  }, []);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    dispatch(
      reArrangeFolders({
        index: result.source.index,
        destination: result.destination.index,
      })
    );
    const newState = store.getState();
    localStorage.setItem("myLinks", JSON.stringify(newState.links.links));
  };

  return (
    <>
      <Navbar />
      <AddFolder />
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="folders">
          {(provided) => {
            return (
              <ul
                className="basic-grid"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {links.links
                  ? links.links.map((link, i) => (
                      <Draggable
                        key={link.id.toString()}
                        draggableId={link.id.toString()}
                        index={i}
                      >
                        {(provided) => {
                          return (
                            <li
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className="folderLi"
                            >
                              <Folder
                                isOpen={link.isOpen}
                                index={i}
                                name={link.name}
                                id={link.id}
                                items={link.items}
                              />
                            </li>
                          );
                        }}
                      </Draggable>
                    ))
                  : null}
                {provided.placeholder}
              </ul>
            );
          }}
        </Droppable>
      </DragDropContext>
    </>
  );
}

export default App;
