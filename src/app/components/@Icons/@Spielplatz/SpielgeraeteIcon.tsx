import React, { lazy, Suspense } from "react";

const LazyShuffleIcon = lazy(() => import("../ShuffleIcon"));
const LazyRutscheIcon = lazy(() => import("./RutscheIcon"));
const LazyKleinkindrutscheIcon = lazy(() => import("./KleinkindRutscheIcon"));
const LazyRöhrenrutscheIcon = lazy(() => import("./RoehrenrutscheIcon"));
const LazySchaukelIcon = lazy(() => import("./SchaukelIcon"));
const LazyKleinkindschaukelIcon = lazy(() => import("./KleinkindSchaukelIcon"));
const LazyNestschaukelIcon = lazy(() => import("./NestschaukelIcon"));
const LazySandspielbereichIcon = lazy(() => import("./SandspielbereichIcon"));
const LazyWasserspielIcon = lazy(() => import("./WasserSpielIcon"));
const LazyWippeIcon = lazy(() => import("./WippeIcon"));
const LazyKarussellIcon = lazy(() => import("./KarussellIcon"));
const LazySeilbahnIcon = lazy(() => import("./SeilbahnIcon"));
const LazyTrampolinIcon = lazy(() => import("./TrampolinIcon"));
const LazyKletterelementIcon = lazy(() => import("./KletterelementIcon"));
const LazyKletternetzpyramideIcon = lazy(
  () => import("./KletternetzpyramideIcon")
);
const LazyKletterwandIcon = lazy(() => import("./KletterwandIcon"));
const LazyReckstangeIcon = lazy(() => import("./ReckstangeIcon"));
const LazyBasketballkorbIcon = lazy(() => import("./BasketballkorbIcon"));
const LazyVolleyballnetzIcon = lazy(() => import("./VolleyballnetzIcon"));
const LazyFußballtoreIcon = lazy(() => import("./FußballtoreIcon"));
const LazyTischtennisplatteIcon = lazy(() => import("./TischtennisplatteIcon"));
const LazySkateparkIcon = lazy(() => import("./SkateparkIcon"));
const LazyRollerIcon = lazy(() => import("./RollerIcon"));
const LazySpielplatzIcon = lazy(() => import("./SpielplatzIcon"));

export default function SpielgeraeteIcon({
  size = "24px",
  color = "#000",
  logo,
  lazy = false,
}: {
  lazy?: boolean;
  size?: string;
  color?: string;
  logo: string;
}) {
  return (
    <Suspense fallback={lazy ? <p className="font-semibold">Ziellos</p> : null}>
      {logo === "shuffle" && <LazyShuffleIcon size={size} color={color} />}
      {logo === "rutsche" && <LazyRutscheIcon size={size} color={color} />}
      {logo === "kleinkindrutsche" && (
        <LazyKleinkindrutscheIcon size={size} color={color} />
      )}
      {logo === "röhrenrutsche" && (
        <LazyRöhrenrutscheIcon size={size} color={color} />
      )}
      {logo === "schaukel" && <LazySchaukelIcon size={size} color={color} />}
      {logo === "kleinkindschaukel" && (
        <LazyKleinkindschaukelIcon size={size} color={color} />
      )}
      {logo === "nestschaukel" && (
        <LazyNestschaukelIcon size={size} color={color} />
      )}
      {logo === "schaukel mit fixiermöglichkeit" && (
        <LazySchaukelIcon size={size} color={color} />
      )}
      {logo === "sandspielbereich" && (
        <LazySandspielbereichIcon size={size} color={color} />
      )}
      {logo === "wasserspiel" && (
        <LazyWasserspielIcon size={size} color={color} />
      )}
      {logo === "wasserspiel / matschen" && (
        <LazyWasserspielIcon size={size} color={color} />
      )}
      {logo === "balancier-spiel" && (
        <LazySpielplatzIcon size={size} color={color} />
      )}
      {logo === "spielplatz" && (
        <LazySpielplatzIcon size={size} color={color} />
      )}

      {logo === "wippe" && <LazyWippeIcon size={size} color={color} />}
      {logo === "karussell" && <LazyKarussellIcon size={size} color={color} />}
      {logo === "inklusives karussella" && (
        <LazyKarussellIcon size={size} color={color} />
      )}
      {logo === "inklusives karussell" && (
        <LazyKarussellIcon size={size} color={color} />
      )}
      {logo === "dreh-element" && (
        <LazyKarussellIcon size={size} color={color} />
      )}
      {logo === "seilbahn" && <LazySeilbahnIcon size={size} color={color} />}
      {logo === "trampolin" && <LazyTrampolinIcon size={size} color={color} />}
      {logo === "kletterelement" && (
        <LazyKletterelementIcon size={size} color={color} />
      )}
      {logo === "kletternetzpyramide" && (
        <LazyKletternetzpyramideIcon size={size} color={color} />
      )}
      {logo === "kletterwand" && (
        <LazyKletterwandIcon size={size} color={color} />
      )}
      {logo === "reckstange" && (
        <LazyReckstangeIcon size={size} color={color} />
      )}
      {logo === "basketballkorb" && (
        <LazyBasketballkorbIcon size={size} color={color} />
      )}
      {logo === "volleyballnetz" && (
        <LazyVolleyballnetzIcon size={size} color={color} />
      )}
      {logo === "fußballtore" && (
        <LazyFußballtoreIcon size={size} color={color} />
      )}
      {logo === "tischtennisplatte" && (
        <LazyTischtennisplatteIcon size={size} color={color} />
      )}
      {logo === "skatepark" && <LazySkateparkIcon size={size} color={color} />}
      {logo.includes("kinderfahrrad") && (
        <LazyRollerIcon size={size} color={color} />
      )}
    </Suspense>
  );
}
