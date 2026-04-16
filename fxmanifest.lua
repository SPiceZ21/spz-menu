fx_version 'cerulean'
game 'gta5'
name 'spz-menu'
description 'SPiceZ-Core — Queue widget, spawner, crew, leaderboard'
version '1.0.0'

ui_page 'ui/dist/index.html'
files { 'ui/dist/**' }

shared_scripts {
  '@spz-lib/shared/main.lua', '@spz-lib/shared/callbacks.lua',
  '@spz-lib/shared/logger.lua', '@spz-lib/shared/notify.lua',
  '@spz-lib/shared/table.lua',
}
server_scripts { '@oxmysql/lib/MySQL.lua', 'config.lua', 'server/main.lua' }
client_scripts {
  'config.lua', 'client/main.lua', 'client/keybinds.lua',
  'client/state.lua', 'client/character_creation.lua', 'client/nui_bridge.lua',
}
dependencies {
  'spz-lib','spz-core','spz-identity','spz-appearance',
  'spz-vehicles','spz-races','spz-leaderboard',
}
