import React, { useState } from "react";
import "./SelectedPlayer.css";
import { PlayerCard } from "../PlayerCard/PlayerCard";

export function SelectedPlayer({ title, players, nbSelected, onSubmit }) {
  const [userSelect, setUserSelect] = useState([]);
  const [isSucesse, setIsSucesse] = useState(false);

  const onSelectedUser = (id) => {
    setUserSelect((state) => {
      if (state.length < nbSelected) {
        return [...state, id];
      }

      state.shift();

      return [...state, id];
    });
  };

  const onSubmitButton = async () => {
    const data = await onSubmit(userSelect);

    if (data.code === 200) {
      setIsSucesse(true);
    }

    return await data
  };

  return (
    <>
      {isSucesse ? (
        <div className="SelectedZone">
          <div className="SelectedZone__header">
            <h2>Sélection Validée</h2>
          </div>
        </div>
      ) : (
        <div className="SelectedZone">
          <div className="SelectedZone__header">
            <h2>{title}</h2>
          </div>
          <ul className="SelectedZone__list">
            {players &&
              players.map((value) => {
                return (
                  <PlayerCard
                    key={value.id + value.name}
                    userInfo={value}
                    isSelected={userSelect.includes(value.id)}
                    onClick={() => onSelectedUser(value.id)}
                  />
                );
              })}
          </ul>
          <div className="SelectedZone__action">
            <button onClick={onSubmitButton}>Valider votre choix</button>
          </div>
        </div>
      )}
    </>
  );
}
