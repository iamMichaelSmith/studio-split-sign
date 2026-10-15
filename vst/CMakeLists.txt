cmake_minimum_required(VERSION 3.22)

project(SplitSheetStudioVST VERSION 0.1.3)

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
    assets/midnight.png
    assets/neon.png
    assets/electric.png
    assets/blueprint.png
    assets/royal.png
    assets/walnut.png
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

juce_add_gui_app(SplitSheetScreenshotRenderer PRODUCT_NAME "Split Sheet Screenshot Renderer")
target_sources(SplitSheetScreenshotRenderer PRIVATE tools/ScreenshotRenderer.cpp)
target_link_libraries(SplitSheetScreenshotRenderer PRIVATE SplitSheetStudio)
target_include_directories(SplitSheetScreenshotRenderer PRIVATE "${juce_SOURCE_DIR}/modules")
target_compile_features(SplitSheetScreenshotRenderer PRIVATE cxx_std_17)
target_compile_definitions(SplitSheetScreenshotRenderer PRIVATE JUCE_GLOBAL_MODULE_SETTINGS_INCLUDED=1 JUCE_STANDALONE_APPLICATION=1)
set_target_properties(SplitSheetScreenshotRenderer PROPERTIES EXCLUDE_FROM_ALL TRUE)

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
