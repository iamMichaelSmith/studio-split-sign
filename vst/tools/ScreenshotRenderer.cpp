#include "../src/PluginProcessor.h"
#include "../src/PluginEditor.h"

// Render the real editor without opening audio hardware or a DAW.
class SplitSheetScreenshotApplication final : public juce::JUCEApplication
{
public:
    const juce::String getApplicationName() override { return "Split Sheet Screenshot Renderer"; }
    const juce::String getApplicationVersion() override { return "1.0"; }
    bool moreThanOneInstanceAllowed() override { return true; }
    void initialise(const juce::String&) override
    {
        if (juce::SystemStats::getEnvironmentVariable("SPLITSHEET_SCREENSHOT_DIR", {}).isEmpty())
        {
            setApplicationReturnValue(1);
            quit();
            return;
        }
        processor = std::make_unique<SplitSheetStudioProcessor>();
        editor = std::make_unique<SplitSheetStudioEditor>(*processor);
    }
    void shutdown() override { editor.reset(); processor.reset(); }
private:
    std::unique_ptr<SplitSheetStudioProcessor> processor;
    std::unique_ptr<SplitSheetStudioEditor> editor;
};

START_JUCE_APPLICATION(SplitSheetScreenshotApplication)
