cmake_minimum_required(VERSION 3.22)

project(SplitSheetStudioVST VERSION 0.1.0)

include(FetchContent)

FetchContent_Declare(
  JUCE
  GIT_REPOSITORY https://github.com/juce-framework/JUCE.git
  GIT_TAG 8.0.4
)

FetchContent_MakeAvailable(JUCE)

juce_add_plugin(SplitSheetStudio
  COMPANY_NAME "Blak Marigold Studio"
  BUNDLE_ID com.blakmarigold.splitsheetstudio
  IS_SYNTH FALSE
  NEEDS_MIDI_INPUT FALSE
  NEEDS_MIDI_OUTPUT FALSE
  IS_MIDI_EFFECT FALSE
  EDITOR_WANTS_KEYBOARD_FOCUS TRUE
  COPY_PLUGIN_AFTER_BUILD FALSE
  PLUGIN_MANUFACTURER_CODE BmSs
  PLUGIN_CODE Sss1
  FORMATS VST3 Standalone
  PRODUCT_NAME "SplitSheet Studio"
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
)

target_link_libraries(SplitSheetStudio
  PRIVATE
    juce::juce_audio_utils
    juce::juce_cryptography
    juce::juce_gui_extra
  PUBLIC
    juce::juce_recommended_config_flags
    juce::juce_recommended_lto_flags
    juce::juce_recommended_warning_flags
)
