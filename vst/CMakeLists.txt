cmake_minimum_required(VERSION 3.22)

project(SplitSheetStudioVST VERSION 0.1.2)

include(FetchContent)

FetchContent_Declare(
  JUCE
  GIT_REPOSITORY https://github.com/juce-framework/JUCE.git
  GIT_TAG 8.0.4
)

FetchContent_MakeAvailable(JUCE)

juce_add_binary_data(SplitSheetAssets
  SOURCES
    ../public/bronze-texture.png
    assets/marigoldlogo.png
    assets/paper-thin.png
    assets/denim.png
    assets/soft.png
    assets/speakeasy.png
    assets/plush.png
)

set(SPLIT_SHEET_PLUGIN_FORMATS VST3 Standalone)
set(SPLIT_SHEET_MANUFACTURER_CODE BmSs)
set(SPLIT_SHEET_PLUGIN_CODE Sss1)

if(APPLE)
  list(APPEND SPLIT_SHEET_PLUGIN_FORMATS AU)
  set(SPLIT_SHEET_MANUFACTURER_CODE Bmss)
  set(SPLIT_SHEET_PLUGIN_CODE Ssst)
endif()

juce_add_plugin(SplitSheetStudio
  COMPANY_NAME "Blak Marigold Studio"
  VERSION ${PROJECT_VERSION}
  BUNDLE_ID com.blakmarigold.splitsheetstudio
  IS_SYNTH FALSE
  NEEDS_MIDI_INPUT FALSE
  NEEDS_MIDI_OUTPUT FALSE
  IS_MIDI_EFFECT FALSE
  EDITOR_WANTS_KEYBOARD_FOCUS TRUE
  COPY_PLUGIN_AFTER_BUILD FALSE
  PLUGIN_MANUFACTURER_CODE ${SPLIT_SHEET_MANUFACTURER_CODE}
  PLUGIN_CODE ${SPLIT_SHEET_PLUGIN_CODE}
  FORMATS ${SPLIT_SHEET_PLUGIN_FORMATS}
  PRODUCT_NAME "Split Sheet Studio"
  AU_MAIN_TYPE kAudioUnitType_Effect
  AU_SANDBOX_SAFE TRUE
  HARDENED_RUNTIME_ENABLED TRUE
)

target_sources(SplitSheetStudio
  PRIVATE
    src/ApiClient.cpp
    src/ApiClient.h
    src/PluginEditor.cpp
    src/PluginEditor.h
    src/PluginProcessor.cpp
    src/PluginProcessor.h
)

target_compile_definitions(SplitSheetStudio
  PUBLIC
    JUCE_WEB_BROWSER=0
    JUCE_USE_CURL=0
    SPLIT_SHEET_STUDIO_VERSION="${PROJECT_VERSION}"
)

if(MSVC)
  target_compile_options(SplitSheetStudio PRIVATE /utf-8)
endif()

target_link_libraries(SplitSheetStudio
  PRIVATE
    SplitSheetAssets
    juce::juce_audio_utils
    juce::juce_cryptography
    juce::juce_gui_extra
  PUBLIC
    juce::juce_recommended_config_flags
    juce::juce_recommended_lto_flags
    juce::juce_recommended_warning_flags
)
