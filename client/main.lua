-- client/main.lua
-- Master NUI visibility controller for spz-menu.
-- Routes server events → NUI messages and manages NUI focus.

-- ── Track which screen is currently open ──────────────────────────────────
local _activeScreen = nil
local _pollOpen     = false

--- Open a named screen (spawner, leaderboard, profile, crewManagement)
local function OpenScreen(name, payload)
    if _activeScreen then
        -- Close the previous screen first
        SendNUIMessage({ type = "CLOSE_SCREEN", data = { name = _activeScreen } })
    end
    _activeScreen = name
    SendNUIMessage({ type = "OPEN_MENU", data = { name = name, payload = payload or {} } })
    SetNuiFocus(true, true)
end

--- Close all screens and release NUI focus
local function CloseAll()
    if _activeScreen then
        SendNUIMessage({ type = "CLOSE_SCREEN", data = { name = _activeScreen } })
    end
    _activeScreen = nil
    SendNUIMessage({ type = "CLOSE_ALL" })
    -- Keep focus alive if the poll is open (same NUI window)
    if not _pollOpen then
        SetNuiFocus(false, false)
    end
end

-- ── NUI callback: UI requested close (Escape key, close button, etc.) ─────
RegisterNUICallback("closeAll", function(_, cb)
    CloseAll()
    if cb then cb("ok") end
end)

-- ── Play menu — shown after loading screen, before first spawn ────────────
RegisterNetEvent("SPZ:showPlayMenu")
AddEventHandler("SPZ:showPlayMenu", function(data)
    -- spz-core/client/spawn_manager.lua shuts down the loading screen in its
    -- own listener for this same event. By the time we run here the screen
    -- is already closed.
    SendNUIMessage({ type = "SPZ_SHOW_PLAY_MENU", payload = data or {} })
    SetNuiFocus(true, true)
end)

-- NUI callback: player pressed ENTER in the play menu
RegisterNUICallback("requestSpawn", function(_, cb)
    SendNUIMessage({ type = "SPZ_HIDE_PLAY_MENU" })
    SetNuiFocus(false, false)
    TriggerServerEvent("SPZ:requestSpawn")
    if cb then cb("ok") end
end)

-- ── Spawner trigger from state.lua ────────────────────────────────────────
AddEventHandler("SPZ:openSpawner", function()
    OpenScreen("spawner")
end)

-- ── Notification routing ──────────────────────────────────────────────────
-- Forward spz-lib:Notify to NUI so NotificationManager can display them
RegisterNetEvent("spz-lib:Notify")
AddEventHandler("spz-lib:Notify", function(msg, msgType, duration)
    SendNUIMessage({
        type    = "notify",
        payload = {
            type    = msgType or "info",
            message = msg,
        },
    })
end)

-- ── Poll — rendered inside spz-menu NUI ──────────────────────────────────
RegisterNetEvent("SPZ:pollOpen")
AddEventHandler("SPZ:pollOpen", function(data)
    _pollOpen = true
    SendNUIMessage({ type = "SPZ_POLL_OPEN", payload = data })
    SetNuiFocus(true, true)
end)

RegisterNetEvent("SPZ:pollResult")
AddEventHandler("SPZ:pollResult", function(data)
    SendNUIMessage({ type = "SPZ_POLL_RESULT", payload = data })
    -- Auto-close focus after vehicle poll resolves (2.8 s matches React timeout)
    if data and data.phase == "vehicle" then
        Citizen.SetTimeout(2900, function()
            _pollOpen = false
            SendNUIMessage({ type = "SPZ_POLL_CLOSE" })
            if not _activeScreen then
                -- Restore cursor for freeroam/queued; race will override to false once LIVE fires
                local state = SPZ_STATE and SPZ_STATE.State or "FREEROAM"
                if state == "RACING" then
                    SetNuiFocus(false, false)
                else
                    SetNuiFocus(true, false)
                end
            end
        end)
    end
end)

-- NUI callback: player voted
-- Server handler expects { index = n }, so wrap the bare number in a table.
RegisterNUICallback("pollVote", function(body, cb)
    TriggerServerEvent("SPZ:pollVote", { index = body.index })
    if cb then cb("ok") end
end)

-- ── Race state: close poll when race starts / resets ─────────────────────
-- Note: do NOT change NUI focus here — spz_race:state_updated broadcasts to ALL
-- clients on the server, including freeroam players who are not in the race.
-- NUI focus for racing players is managed by SPZ:stateChanged (per-player).
RegisterNetEvent("spz_race:state_updated")
AddEventHandler("spz_race:state_updated", function(newState)
    if newState == "IDLE" or newState == "COUNTDOWN" or newState == "LIVE" then
        _pollOpen = false
        SendNUIMessage({ type = "SPZ_POLL_CLOSE" })
    end
end)

-- ── Escape key handling ───────────────────────────────────────────────────
-- When the menu NUI has focus, pressing Escape (INPUT_FRONTEND_CANCEL = 200
-- or INPUT_FRONTEND_PAUSE_ALTERNATE = 199) should close the UI.
-- The NUI itself also fires "closeAll" from the JS side; this Lua-side
-- Thread catches cases where focus is stuck without a matching JS handler.
CreateThread(function()
    while true do
        Wait(0)
        if _activeScreen then
            -- Backspace (INPUT_CELLPHONE_CANCEL) or Escape when NUI focus is on
            if IsControlJustPressed(0, 177) then  -- BACKSPACE / ESC fallback
                CloseAll()
            end
        end
    end
end)
