-- client/main.lua
-- Master NUI visibility controller for spz-menu.
-- Routes server events → NUI messages and manages NUI focus.

-- ── Track which screen is currently open ──────────────────────────────────
local _activeScreen = nil

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
    SetNuiFocus(false, false)
end

-- ── NUI callback: UI requested close (Escape key, close button, etc.) ─────
RegisterNUICallback("closeAll", function(_, cb)
    CloseAll()
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

-- ── Poll notification ("Press E to vote") routed from spz-hud ─────────────
RegisterNetEvent("SPZ:pollNotifyToMenu")
AddEventHandler("SPZ:pollNotifyToMenu", function(data)
    SendNUIMessage({
        type    = "notify",
        payload = {
            type    = "info",
            title   = data and data.title or "Race Poll",
            message = data and data.message or "Press E to vote",
        },
    })
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
