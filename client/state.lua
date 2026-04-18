SPZ_STATE = {}
SPZ_STATE.State = "FREEROAM" -- FREEROAM | QUEUED | RACING

-- ── NUI focus helper ──────────────────────────────────────────────────────
-- FREEROAM / QUEUED → cursor ON, game input ON  (JOIN button is clickable while driving)
-- RACING            → no cursor                  (full game control during race)
-- A full-focus override (SetNuiFocus(true,true)) is applied by spz-menu/client/main.lua
-- during poll voting or when a fullscreen menu is open; this helper only manages the
-- baseline cursor state between those events.

local function ApplyFocusForState(state)
    if state == "RACING" then
        SetNuiFocus(false, false)
    else
        -- FREEROAM, QUEUED, or anything else → show cursor, keep game input
        SetNuiFocus(true, false)
    end
end

-- ── Server → client: per-player state change ─────────────────────────────
-- Server fires: TriggerClientEvent("SPZ:stateChanged", source, oldState, newState)
-- so the handler receives TWO arguments: oldState, newState.
RegisterNetEvent("SPZ:stateChanged")
AddEventHandler("SPZ:stateChanged", function(oldState, newState)
    SPZ_STATE.State = newState
    ApplyFocusForState(newState)
    SendNUIMessage({
        type    = "SPZ_UPDATE_STATE",
        payload = { state = newState },
    })
end)

-- ── Race state broadcasts (applies to ALL clients) ────────────────────────
-- Use for poll-open status only; do NOT change NUI focus here because this
-- event fires for every player on the server (including freeroam spectators).
RegisterNetEvent("spz_race:state_updated")
AddEventHandler("spz_race:state_updated", function(newState)
    SendNUIMessage({
        type    = "SPZ_POLL_STATUS",
        payload = { isOpen = (newState == "POLLING"), raceState = newState },
    })
end)

-- ── Identity ready → request vehicle list ────────────────────────────────
RegisterNetEvent("SPZ:identityReady")
AddEventHandler("SPZ:identityReady", function()
    TriggerServerEvent("SPZ:requestVehicleList")
    -- Also restore cursor (identity ready fires just after spawn completes)
    ApplyFocusForState(SPZ_STATE.State)
end)

RegisterNetEvent("SPZ:vehicleListReady")
AddEventHandler("SPZ:vehicleListReady", function(classList)
    SendNUIMessage({
        type    = "SPZ:openSpawner",
        payload = { classes = classList },
    })
end)

-- ── Live queue count ──────────────────────────────────────────────────────
RegisterNetEvent("SPZ:queueUpdated")
AddEventHandler("SPZ:queueUpdated", function(data)
    local widgetState = "idle"
    if SPZ_STATE.State == "QUEUED" then widgetState = "queued" end
    SendNUIMessage({
        type    = "SPZ_QUEUE_INIT",
        payload = {
            state      = widgetState,
            queueCount = data.count or 0,
            trackType  = data.raceType or "",
            pollOpen   = data.raceState == "POLLING",
        },
    })
end)

-- ── Rank / License toasts ─────────────────────────────────────────────────
RegisterNetEvent("SPZ:rankChanged")
AddEventHandler("SPZ:rankChanged", function(data)
    SendNUIMessage({
        type    = "notify",
        payload = { type = "rankup", title = data.title, message = data.message },
    })
end)

RegisterNetEvent("SPZ:licenseUnlocked")
AddEventHandler("SPZ:licenseUnlocked", function(data)
    SendNUIMessage({
        type    = "notify",
        payload = { type = "unlock", title = data.title, classTag = data.classTag },
    })
end)

RegisterNetEvent("SPZ:crewChanged")
AddEventHandler("SPZ:crewChanged", function(data)
    SendNUIMessage({ type = "crewManagement", payload = data })
end)
