#include "PluginEditor.h"
#include <BinaryData.h>
#include <array>
#include <cmath>
#include <cstdlib>

#ifndef SPLIT_SHEET_STUDIO_VERSION
#define SPLIT_SHEET_STUDIO_VERSION "0.1.2"
#endif

namespace
{
    const juce::String currentPluginVersion { SPLIT_SHEET_STUDIO_VERSION };
    constexpr int defaultEditorWidth = 920;
    constexpr int defaultEditorHeight = 680;
    constexpr int authedMinEditorWidth = 860;
    constexpr int authedMinEditorHeight = 620;
    constexpr int loginMinEditorWidth = 720;
    constexpr int loginMinEditorHeight = 560;
    constexpr int loginUpdateMinEditorHeight = 620;
    constexpr int maxEditorWidth = 1800;
    constexpr int maxEditorHeight = 1400;
    constexpr int screenshotSongWidth = 1280;
    constexpr int screenshotSongHeight = 900;
    constexpr int screenshotContributorsWidth = 1280;
    constexpr int screenshotContributorsHeight = 1260;
    constexpr int screenshotReviewWidth = 1280;
    constexpr int screenshotReviewHeight = 980;
    constexpr const char* screenshotDirEnvVar = "SPLITSHEET_SCREENSHOT_DIR";

    SplitSheetThemePalette paletteForTheme(SplitSheetTheme theme)
    {
        switch (theme)
        {
            case SplitSheetTheme::paperThin:
                return {
                    juce::Colour::fromRGB(30, 29, 27), juce::Colour::fromRGB(50, 48, 44),
                    juce::Colour::fromRGB(38, 37, 34), juce::Colour::fromRGB(26, 25, 23),
                    juce::Colour::fromRGB(245, 241, 232), juce::Colour::fromRGB(173, 151, 112),
                    juce::Colour::fromRGB(205, 158, 75), juce::Colour::fromRGB(67, 145, 99),
                    juce::Colour::fromRGB(166, 120, 42), juce::Colour::fromRGB(161, 68, 61),
                    juce::Colour::fromRGB(101, 95, 84), juce::Colour::fromRGB(255, 252, 246),
                    juce::Colour::fromRGB(222, 214, 201), juce::Colour::fromRGB(116, 108, 96),
                    juce::Colour::fromRGB(33, 29, 24), 0.20f
                };
            case SplitSheetTheme::denim:
                return {
                    juce::Colour::fromRGB(8, 30, 49), juce::Colour::fromRGB(18, 57, 86),
                    juce::Colour::fromRGB(12, 41, 65), juce::Colour::fromRGB(7, 27, 44),
                    juce::Colour::fromRGB(24, 64, 94), juce::Colour::fromRGB(109, 151, 180),
                    juce::Colour::fromRGB(232, 194, 111), juce::Colour::fromRGB(69, 158, 113),
                    juce::Colour::fromRGB(179, 132, 52), juce::Colour::fromRGB(177, 71, 66),
                    juce::Colour::fromRGB(54, 92, 120), juce::Colour::fromRGB(249, 246, 236),
                    juce::Colour::fromRGB(199, 218, 231), juce::Colour::fromRGB(155, 183, 203),
                    juce::Colour::fromRGB(249, 246, 236), 0.24f
                };
            case SplitSheetTheme::soft:
                return {
                    juce::Colour::fromRGB(43, 34, 27), juce::Colour::fromRGB(83, 66, 51),
                    juce::Colour::fromRGB(61, 48, 38), juce::Colour::fromRGB(37, 29, 23),
                    juce::Colour::fromRGB(99, 81, 65), juce::Colour::fromRGB(186, 153, 112),
                    juce::Colour::fromRGB(240, 198, 132), juce::Colour::fromRGB(75, 151, 107),
                    juce::Colour::fromRGB(161, 118, 49), juce::Colour::fromRGB(157, 68, 61),
                    juce::Colour::fromRGB(111, 88, 69), juce::Colour::fromRGB(255, 246, 231),
                    juce::Colour::fromRGB(226, 207, 181), juce::Colour::fromRGB(190, 163, 128),
                    juce::Colour::fromRGB(255, 246, 231), 0.22f
                };
            case SplitSheetTheme::speakeasy:
                return {
                    juce::Colour::fromRGB(7, 7, 7), juce::Colour::fromRGB(28, 23, 21),
                    juce::Colour::fromRGB(19, 16, 15), juce::Colour::fromRGB(11, 10, 10),
                    juce::Colour::fromRGB(34, 29, 27), juce::Colour::fromRGB(112, 82, 59),
                    juce::Colour::fromRGB(216, 169, 98), juce::Colour::fromRGB(71, 145, 101),
                    juce::Colour::fromRGB(166, 119, 53), juce::Colour::fromRGB(150, 61, 56),
                    juce::Colour::fromRGB(70, 59, 52), juce::Colour::fromRGB(248, 235, 214),
                    juce::Colour::fromRGB(204, 181, 151), juce::Colour::fromRGB(145, 126, 106),
                    juce::Colour::fromRGB(248, 235, 214), 0.28f
                };
            case SplitSheetTheme::plush:
                return {
                    juce::Colour::fromRGB(48, 40, 33), juce::Colour::fromRGB(91, 76, 62),
                    juce::Colour::fromRGB(62, 52, 43), juce::Colour::fromRGB(35, 30, 26),
                    juce::Colour::fromRGB(248, 243, 233), juce::Colour::fromRGB(188, 154, 105),
                    juce::Colour::fromRGB(232, 188, 106), juce::Colour::fromRGB(76, 151, 106),
                    juce::Colour::fromRGB(166, 119, 49), juce::Colour::fromRGB(158, 67, 61),
                    juce::Colour::fromRGB(112, 92, 74), juce::Colour::fromRGB(255, 249, 239),
                    juce::Colour::fromRGB(231, 214, 190), juce::Colour::fromRGB(121, 105, 88),
                    juce::Colour::fromRGB(43, 35, 29), 0.20f
                };
            case SplitSheetTheme::bronze:
            default:
                return {
                    juce::Colour::fromRGB(27, 17, 12), juce::Colour::fromRGB(74, 49, 35),
                    juce::Colour::fromRGB(53, 35, 25), juce::Colour::fromRGB(40, 25, 18),
                    juce::Colour::fromRGB(70, 48, 36), juce::Colour::fromRGB(151, 101, 66),
                    juce::Colour::fromRGB(243, 189, 130), juce::Colour::fromRGB(71, 151, 105),
                    juce::Colour::fromRGB(145, 109, 44), juce::Colour::fromRGB(145, 64, 58),
                    juce::Colour::fromRGB(95, 65, 47), juce::Colour::fromRGB(255, 242, 223),
                    juce::Colour::fromRGB(229, 200, 170), juce::Colour::fromRGB(184, 145, 115),
                    juce::Colour::fromRGB(255, 242, 223), 0.16f
                };
        }
    }

    SplitSheetTheme themeFromKey(const juce::String& key)
    {
        if (key == "paper-thin") return SplitSheetTheme::paperThin;
        if (key == "denim") return SplitSheetTheme::denim;
        if (key == "soft") return SplitSheetTheme::soft;
        if (key == "speakeasy") return SplitSheetTheme::speakeasy;
        if (key == "plush") return SplitSheetTheme::plush;
        return SplitSheetTheme::bronze;
    }

    juce::String keyForTheme(SplitSheetTheme theme)
    {
        switch (theme)
        {
            case SplitSheetTheme::paperThin: return "paper-thin";
            case SplitSheetTheme::denim: return "denim";
            case SplitSheetTheme::soft: return "soft";
            case SplitSheetTheme::speakeasy: return "speakeasy";
            case SplitSheetTheme::plush: return "plush";
            case SplitSheetTheme::bronze:
            default: return "bronze";
        }
    }

    juce::Image textureForTheme(SplitSheetTheme theme)
    {
        switch (theme)
        {
            case SplitSheetTheme::paperThin:
                return juce::ImageCache::getFromMemory(BinaryData::paperthin_png, BinaryData::paperthin_pngSize);
            case SplitSheetTheme::denim:
                return juce::ImageCache::getFromMemory(BinaryData::denim_png, BinaryData::denim_pngSize);
            case SplitSheetTheme::soft:
                return juce::ImageCache::getFromMemory(BinaryData::soft_png, BinaryData::soft_pngSize);
            case SplitSheetTheme::speakeasy:
                return juce::ImageCache::getFromMemory(BinaryData::speakeasy_png, BinaryData::speakeasy_pngSize);
            case SplitSheetTheme::plush:
                return juce::ImageCache::getFromMemory(BinaryData::plush_png, BinaryData::plush_pngSize);
            case SplitSheetTheme::bronze:
            default:
                return juce::ImageCache::getFromMemory(BinaryData::bronzetexture_png, BinaryData::bronzetexture_pngSize);
        }
    }

    juce::String todayIso()
    {
        return juce::Time::getCurrentTime().formatted("%Y-%m-%d");
    }

    void styleEditor(juce::TextEditor& editor, const juce::String& placeholder,
                     const SplitSheetThemePalette& palette, bool multiline = false)
    {
        editor.setTextToShowWhenEmpty(placeholder, palette.placeholder);
        editor.setColour(juce::TextEditor::backgroundColourId, palette.field);
        editor.setColour(juce::TextEditor::outlineColourId, palette.fieldOutline);
        editor.setColour(juce::TextEditor::focusedOutlineColourId, palette.accent);
        editor.setColour(juce::TextEditor::textColourId, palette.fieldText);
        editor.setColour(juce::TextEditor::highlightedTextColourId, juce::Colours::black);
        editor.setColour(juce::TextEditor::highlightColourId, palette.accent);
        editor.setColour(juce::CaretComponent::caretColourId, palette.accent);
        editor.setIndents(12, multiline ? 11 : 8);
        editor.setMultiLine(multiline, true);
        editor.setReturnKeyStartsNewLine(multiline);
        editor.setScrollbarsShown(multiline);
    }

    void styleComboBox(juce::ComboBox& comboBox, const juce::String& placeholder,
                       const SplitSheetThemePalette& palette)
    {
        comboBox.setTextWhenNothingSelected(placeholder);
        comboBox.setJustificationType(juce::Justification::centredLeft);
        comboBox.setColour(juce::ComboBox::backgroundColourId, palette.field);
        comboBox.setColour(juce::ComboBox::outlineColourId, palette.fieldOutline);
        comboBox.setColour(juce::ComboBox::focusedOutlineColourId, palette.accent);
        comboBox.setColour(juce::ComboBox::textColourId, palette.fieldText);
        comboBox.setColour(juce::ComboBox::arrowColourId, palette.accent);
    }

    void styleButton(juce::TextButton& button,
                     const SplitSheetThemePalette& palette,
                     juce::Colour colour,
                     juce::Colour text)
    {
        button.setColour(juce::TextButton::buttonColourId, colour);
        button.setColour(juce::TextButton::buttonOnColourId, palette.accent);
        button.setColour(juce::TextButton::textColourOffId, text);
        button.setColour(juce::TextButton::textColourOnId, juce::Colours::black);
    }

    void styleButton(juce::TextButton& button, const SplitSheetThemePalette& palette)
    {
        styleButton(button, palette, palette.card, palette.primaryText);
    }

    void styleStepButton(juce::TextButton& button, bool active, const SplitSheetThemePalette& palette)
    {
        styleButton(button, palette, active ? palette.accent : palette.card,
                    active ? palette.card : palette.secondaryText);
    }

    void styleLabel(juce::Label& label, const SplitSheetThemePalette& palette,
                    float size = 14.0f, bool bold = true)
    {
        label.setColour(juce::Label::textColourId, palette.primaryText);
        label.setFont(juce::FontOptions(size, bold ? juce::Font::bold : juce::Font::plain));
    }

    void styleToggle(juce::ToggleButton& toggle, const SplitSheetThemePalette& palette)
    {
        toggle.setColour(juce::ToggleButton::textColourId, palette.secondaryText);
        toggle.setColour(juce::ToggleButton::tickColourId, palette.accent);
        toggle.setColour(juce::ToggleButton::tickDisabledColourId, palette.fieldOutline);
    }

    juce::StringArray parseEmailTokens(const juce::String& value)
    {
        juce::StringArray tokens;
        tokens.addTokens(value, ",;", "\"");
        tokens.trim();
        tokens.removeEmptyStrings();
        return tokens;
    }

    juce::String formatPercent(double value)
    {
        return juce::String(value, 2).trimCharactersAtEnd("0").trimCharactersAtEnd(".") + "%";
    }

    double shareValue(const juce::String& value)
    {
        return value.trim().getDoubleValue();
    }

    double effectivePublisherShare(const juce::TextEditor& writerShareEditor, const juce::TextEditor& publisherShareEditor)
    {
        const auto publisherText = publisherShareEditor.getText().trim();
        return publisherText.isNotEmpty() ? shareValue(publisherText) : shareValue(writerShareEditor.getText());
    }

    void drawBrandMark(juce::Graphics& graphics, juce::Rectangle<float> area,
                       const SplitSheetThemePalette& palette)
    {
        juce::ColourGradient markGradient(juce::Colour::fromRGB(72, 63, 54), area.getX(), area.getY(),
                                          juce::Colour::fromRGB(18, 15, 14), area.getRight(), area.getBottom(), false);
        graphics.setGradientFill(markGradient);
        graphics.fillEllipse(area);
        graphics.setColour(palette.accent.withAlpha(0.7f));
        graphics.drawEllipse(area.reduced(0.75f), 1.2f);

        const auto logo = juce::ImageCache::getFromMemory(BinaryData::marigoldlogo_png,
                                                          BinaryData::marigoldlogo_pngSize);
        if (logo.isValid())
        {
            auto logoArea = area.reduced(area.getWidth() * 0.12f);
            graphics.drawImageWithin(logo,
                                     static_cast<int>(logoArea.getX()),
                                     static_cast<int>(logoArea.getY()),
                                     static_cast<int>(logoArea.getWidth()),
                                     static_cast<int>(logoArea.getHeight()),
                                     juce::RectanglePlacement::centred | juce::RectanglePlacement::onlyReduceInSize,
                                     false);
            return;
        }

        graphics.setColour(palette.accent);
        graphics.setFont(juce::FontOptions(10.5f, juce::Font::bold));
        graphics.drawFittedText("BM", area.toNearestInt(), juce::Justification::centred, 1);
    }
}

class SplitSheetStudioEditor::PremiumLookAndFeel final : public juce::LookAndFeel_V4
{
public:
    explicit PremiumLookAndFeel(const SplitSheetThemePalette& initialPalette)
        : palette(initialPalette)
    {
        applyPalette();
    }

    void setPalette(const SplitSheetThemePalette& newPalette)
    {
        palette = newPalette;
        applyPalette();
    }

private:
    void applyPalette()
    {
        setColour(juce::PopupMenu::backgroundColourId, palette.card);
        setColour(juce::PopupMenu::textColourId, palette.primaryText);
        setColour(juce::PopupMenu::highlightedBackgroundColourId, palette.accent);
        setColour(juce::PopupMenu::highlightedTextColourId, palette.card);
        setColour(juce::ScrollBar::thumbColourId, palette.secondaryText.withAlpha(0.56f));
        setColour(juce::ScrollBar::trackColourId, juce::Colours::transparentBlack);
    }

public:

    void drawButtonBackground(juce::Graphics& graphics,
                              juce::Button& button,
                              const juce::Colour& background,
                              bool isHighlighted,
                              bool isDown) override
    {
        auto bounds = button.getLocalBounds().toFloat().reduced(0.75f);
        const auto highlightAmount = isHighlighted ? 0.08f : 0.0f;
        const auto pressAmount = isDown ? 0.12f : 0.0f;
        const auto topColour = (background == palette.accent ? palette.accent.brighter(0.22f) : background.brighter(0.06f + highlightAmount)).darker(pressAmount);
        const auto bottomColour = (background == palette.accent ? palette.accent.darker(0.28f) : background.darker(0.10f)).darker(pressAmount);
        juce::ColourGradient buttonGradient(topColour, bounds.getCentreX(), bounds.getY(),
                                            bottomColour, bounds.getCentreX(), bounds.getBottom(), false);
        graphics.setGradientFill(buttonGradient);
        graphics.fillRoundedRectangle(bounds, 6.0f);
        graphics.setColour((background == palette.accent ? palette.accent.brighter(0.18f) : palette.secondaryText.withAlpha(isHighlighted ? 0.72f : 0.34f)));
        graphics.drawRoundedRectangle(bounds, 6.0f, 1.0f);

        auto highlight = bounds.reduced(1.0f).removeFromTop(1.0f);
        graphics.setColour(juce::Colours::white.withAlpha(isHighlighted ? 0.16f : 0.07f));
        graphics.fillRect(highlight);
    }

    void drawButtonText(juce::Graphics& graphics,
                        juce::TextButton& button,
                        bool,
                        bool) override
    {
        graphics.setFont(juce::FontOptions(12.5f, juce::Font::bold));
        graphics.setColour(button.findColour(button.getToggleState()
                                                 ? juce::TextButton::textColourOnId
                                                 : juce::TextButton::textColourOffId)
                               .withMultipliedAlpha(button.isEnabled() ? 1.0f : 0.42f));
        graphics.drawFittedText(button.getButtonText(), button.getLocalBounds().reduced(8, 2), juce::Justification::centred, 1);
    }

    void drawComboBox(juce::Graphics& graphics,
                      int width,
                      int height,
                      bool,
                      int,
                      int,
                      int,
                      int,
                      juce::ComboBox& box) override
    {
        auto bounds = juce::Rectangle<float>(0.5f, 0.5f, static_cast<float>(width - 1), static_cast<float>(height - 1));
        graphics.setColour(box.findColour(juce::ComboBox::backgroundColourId));
        graphics.fillRoundedRectangle(bounds, 6.0f);
        graphics.setColour(box.hasKeyboardFocus(true) ? palette.accent : palette.fieldOutline);
        graphics.drawRoundedRectangle(bounds, 6.0f, box.hasKeyboardFocus(true) ? 1.5f : 1.0f);

        juce::Path arrow;
        const auto centreX = static_cast<float>(width - 17);
        const auto centreY = static_cast<float>(height) * 0.5f;
        arrow.startNewSubPath(centreX - 4.0f, centreY - 2.0f);
        arrow.lineTo(centreX, centreY + 2.0f);
        arrow.lineTo(centreX + 4.0f, centreY - 2.0f);
        graphics.setColour(palette.accent);
        graphics.strokePath(arrow, juce::PathStrokeType(1.6f));
    }

    void positionComboBoxText(juce::ComboBox& box, juce::Label& label) override
    {
        label.setBounds(12, 1, box.getWidth() - 34, box.getHeight() - 2);
        label.setFont(juce::FontOptions(12.5f));
    }

    void fillTextEditorBackground(juce::Graphics& graphics, int width, int height, juce::TextEditor& editor) override
    {
        graphics.setColour(editor.findColour(juce::TextEditor::backgroundColourId));
        graphics.fillRoundedRectangle(juce::Rectangle<float>(0.0f, 0.0f, static_cast<float>(width), static_cast<float>(height)), 6.0f);
    }

    void drawTextEditorOutline(juce::Graphics& graphics, int width, int height, juce::TextEditor& editor) override
    {
        auto bounds = juce::Rectangle<float>(0.5f, 0.5f, static_cast<float>(width - 1), static_cast<float>(height - 1));
        graphics.setColour(editor.hasKeyboardFocus(true) ? palette.accent : palette.fieldOutline);
        graphics.drawRoundedRectangle(bounds, 6.0f, editor.hasKeyboardFocus(true) ? 1.5f : 1.0f);
    }

    void drawToggleButton(juce::Graphics& graphics,
                          juce::ToggleButton& button,
                          bool isHighlighted,
                          bool) override
    {
        auto box = juce::Rectangle<float>(2.0f, (static_cast<float>(button.getHeight()) - 17.0f) * 0.5f, 17.0f, 17.0f);
        graphics.setColour(button.getToggleState() ? palette.accent : palette.field);
        graphics.fillRoundedRectangle(box, 4.0f);
        graphics.setColour(button.getToggleState() ? palette.accent.brighter(0.15f) : palette.secondaryText.withAlpha(isHighlighted ? 0.8f : 0.42f));
        graphics.drawRoundedRectangle(box, 4.0f, 1.0f);

        if (button.getToggleState())
        {
            juce::Path tick;
            tick.startNewSubPath(5.8f, box.getCentreY());
            tick.lineTo(9.0f, box.getBottom() - 4.6f);
            tick.lineTo(15.5f, box.getY() + 4.8f);
            graphics.setColour(juce::Colour::fromRGB(54, 48, 42));
            graphics.strokePath(tick, juce::PathStrokeType(1.9f, juce::PathStrokeType::curved, juce::PathStrokeType::rounded));
        }

        graphics.setColour(button.findColour(juce::ToggleButton::textColourId).withMultipliedAlpha(button.isEnabled() ? 1.0f : 0.45f));
        graphics.setFont(juce::FontOptions(12.5f));
        graphics.drawFittedText(button.getButtonText(), button.getLocalBounds().withTrimmedLeft(29), juce::Justification::centredLeft, 2);
    }

private:
    SplitSheetThemePalette palette;
};

class SplitSheetStudioEditor::PaintedComponent final : public juce::Component
{
public:
    std::function<void(juce::Graphics&)> onPaint;

    void paint(juce::Graphics& graphics) override
    {
        graphics.fillAll(juce::Colours::transparentBlack);
        if (onPaint)
            onPaint(graphics);
    }
};

class SplitSheetStudioEditor::SignaturePad final : public juce::Component
{
public:
    explicit SignaturePad(std::function<void()> onChangedCallback)
        : onChanged(std::move(onChangedCallback))
    {
        setMouseCursor(juce::MouseCursor::CrosshairCursor);
    }

    void setPalette(const SplitSheetThemePalette& newPalette)
    {
        palette = newPalette;
        repaint();
    }

    void paint(juce::Graphics& graphics) override
    {
        auto area = getLocalBounds().toFloat();
        graphics.setColour(palette.field);
        graphics.fillRoundedRectangle(area, 8.0f);

        if (signatureImage.isValid())
            graphics.drawImageWithin(signatureImage, 0, 0, getWidth(), getHeight(), juce::RectanglePlacement::stretchToFit);

        graphics.setColour(palette.accent.withAlpha(hasSignature ? 0.85f : 0.45f));
        graphics.drawRoundedRectangle(area.reduced(0.5f), 8.0f, 1.4f);

        if (!hasSignature)
        {
            graphics.setColour(palette.placeholder);
            graphics.setFont(juce::FontOptions(13.0f));
            graphics.drawFittedText("Draw signature", getLocalBounds(), juce::Justification::centred, 1);
        }
    }

    void resized() override
    {
        if (getWidth() <= 0 || getHeight() <= 0)
            return;

        if (!signatureImage.isValid())
        {
            signatureImage = juce::Image(juce::Image::ARGB, getWidth(), getHeight(), true);
            return;
        }

        if (signatureImage.getWidth() == getWidth() && signatureImage.getHeight() == getHeight())
            return;

        juce::Image resizedImage(juce::Image::ARGB, getWidth(), getHeight(), true);
        juce::Graphics graphics(resizedImage);
        graphics.drawImageWithin(signatureImage, 0, 0, getWidth(), getHeight(), juce::RectanglePlacement::stretchToFit);
        signatureImage = resizedImage;
    }

    void mouseDown(const juce::MouseEvent& event) override
    {
        ensureImage();
        lastPoint = event.position;
        drawPoint(lastPoint);
    }

    void mouseDrag(const juce::MouseEvent& event) override
    {
        ensureImage();
        juce::Graphics graphics(signatureImage);
        graphics.setColour(palette.fieldText);
        graphics.drawLine(lastPoint.x, lastPoint.y, event.position.x, event.position.y, 2.4f);
        lastPoint = event.position;
        hasSignature = true;
        repaint();
        if (onChanged)
            onChanged();
    }

    void clear()
    {
        if (signatureImage.isValid())
            signatureImage.clear(signatureImage.getBounds(), juce::Colours::transparentBlack);

        hasSignature = false;
        repaint();
        if (onChanged)
            onChanged();
    }

    bool isSigned() const
    {
        return hasSignature;
    }

    juce::String toDataUrl() const
    {
        if (!hasSignature || !signatureImage.isValid())
            return {};

        juce::MemoryOutputStream stream;
        juce::PNGImageFormat png;
        png.writeImageToStream(signatureImage, stream);
        return "data:image/png;base64," + stream.getMemoryBlock().toBase64Encoding();
    }

private:
    void ensureImage()
    {
        if (!signatureImage.isValid() || signatureImage.getWidth() != getWidth() || signatureImage.getHeight() != getHeight())
            resized();
    }

    void drawPoint(juce::Point<float> point)
    {
        juce::Graphics graphics(signatureImage);
        graphics.setColour(juce::Colours::white);
        graphics.fillEllipse(point.x - 1.6f, point.y - 1.6f, 3.2f, 3.2f);
        hasSignature = true;
        repaint();
        if (onChanged)
            onChanged();
    }

    std::function<void()> onChanged;
    SplitSheetThemePalette palette { paletteForTheme(SplitSheetTheme::bronze) };
    juce::Image signatureImage;
    juce::Point<float> lastPoint;
    bool hasSignature = false;
};

SplitSheetStudioEditor::SplitSheetStudioEditor(SplitSheetStudioProcessor& value)
    : juce::AudioProcessorEditor(&value),
      processor(value),
      currentTheme(themeFromKey(value.getThemeKey())),
      palette(paletteForTheme(currentTheme))
{
    if (const auto* screenshotDir = std::getenv(screenshotDirEnvVar))
    {
        const juce::String screenshotDirPath(screenshotDir);
        if (screenshotDirPath.isNotEmpty())
        {
            backendScreenshotMode = true;
            backendScreenshotDir = juce::File(screenshotDirPath);
        }
    }

    premiumLookAndFeel = std::make_unique<PremiumLookAndFeel>(palette);
    setLookAndFeel(premiumLookAndFeel.get());

    contributorsCanvas = std::make_unique<PaintedComponent>();
    contributorsCanvas->onPaint = [this](juce::Graphics& graphics)
    {
        for (const auto& cardBounds : contributorCardBounds)
        {
            graphics.setColour(palette.card);
            graphics.fillRoundedRectangle(cardBounds.toFloat(), 10.0f);
            graphics.setColour(palette.secondaryText.withAlpha(0.24f));
            graphics.drawRoundedRectangle(cardBounds.toFloat(), 10.0f, 1.0f);
        }
    };
    contributorsViewport.setViewedComponent(contributorsCanvas.get(), false);
    contributorsViewport.setScrollBarsShown(true, false);
    contributorsViewport.setScrollBarThickness(10);

    titleLabel.setText("Split Sheet Studio", juce::dontSendNotification);
    titleLabel.setJustificationType(juce::Justification::centredLeft);
    titleLabel.setColour(juce::Label::textColourId, palette.primaryText);
    titleLabel.setFont(juce::FontOptions(25.0f, juce::Font::bold));

    subtitleLabel.setText("Rights Clarity for Music Projects", juce::dontSendNotification);
    subtitleLabel.setJustificationType(juce::Justification::centredLeft);
    subtitleLabel.setColour(juce::Label::textColourId, palette.secondaryText);
    subtitleLabel.setFont(juce::FontOptions(12.5f));

    statusLabel.setJustificationType(juce::Justification::centredLeft);
    statusLabel.setColour(juce::Label::textColourId, palette.secondaryText);
    statusLabel.setFont(juce::FontOptions(14.0f, juce::Font::plain));

    statusBadgeLabel.setText("SYSTEM", juce::dontSendNotification);
    statusBadgeLabel.setJustificationType(juce::Justification::centred);
    statusBadgeLabel.setColour(juce::Label::textColourId, palette.primaryText);
    statusBadgeLabel.setFont(juce::FontOptions(12.5f, juce::Font::bold));
    statusBadgeLabel.setOpaque(true);

    baseUrlLabel.setText("App Address", juce::dontSendNotification);
    emailLabel.setText("Email", juce::dontSendNotification);
    passwordLabel.setText("Password", juce::dontSendNotification);
    welcomeLabel.setJustificationType(juce::Justification::centredLeft);
    welcomeLabel.setColour(juce::Label::textColourId, palette.primaryText);
    welcomeLabel.setFont(juce::FontOptions(15.0f, juce::Font::bold));

    songTitleLabel.setText("Song Title", juce::dontSendNotification);
    alternateTitleLabel.setText("Alternate Title", juce::dontSendNotification);
    dateLabel.setText("Date", juce::dontSendNotification);
    sessionLocationLabel.setText("Session Location", juce::dontSendNotification);
    iswcLabel.setText("ISWC", juce::dontSendNotification);
    isrcLabel.setText("ISRC", juce::dontSendNotification);
    notesLabel.setText("Notes", juce::dontSendNotification);

    contributorsLabel.setText("Contributors", juce::dontSendNotification);
    contributorsHintLabel.setText("Includes legal name, contact, PRO details, shares, typed signature, and drawn signature.", juce::dontSendNotification);
    contributorsHintLabel.setJustificationType(juce::Justification::centredLeft);
    contributorsHintLabel.setColour(juce::Label::textColourId, palette.secondaryText);
    contributorsHintLabel.setFont(juce::FontOptions(12.5f));

    totalsLabel.setJustificationType(juce::Justification::centredLeft);
    totalsLabel.setColour(juce::Label::textColourId, palette.secondaryText);
    totalsLabel.setFont(juce::FontOptions(12.5f, juce::Font::bold));

    recipientsLabel.setText("Recipients", juce::dontSendNotification);
    additionalRecipientsLabel.setText("Additional Recipients", juce::dontSendNotification);
    agreementsLabel.setText("Confirmations", juce::dontSendNotification);
    reviewSummaryTitleLabel.setText("Review Summary", juce::dontSendNotification);
    reviewSummaryLabel.setJustificationType(juce::Justification::topLeft);
    reviewSummaryLabel.setColour(juce::Label::textColourId, palette.secondaryText);
    reviewSummaryLabel.setFont(juce::FontOptions(13.0f));

    validationLabel.setJustificationType(juce::Justification::centredLeft);
    validationLabel.setColour(juce::Label::textColourId, palette.secondaryText);
    validationLabel.setFont(juce::FontOptions(12.5f));

    updateNoticeLabel.setJustificationType(juce::Justification::centredLeft);
    updateNoticeLabel.setColour(juce::Label::textColourId, palette.accent);
    updateNoticeLabel.setFont(juce::FontOptions(12.0f, juce::Font::bold));

    for (auto* label : std::array<juce::Label*, 14>{
             &baseUrlLabel, &emailLabel, &passwordLabel, &songTitleLabel, &alternateTitleLabel,
             &dateLabel, &sessionLocationLabel, &iswcLabel, &isrcLabel, &notesLabel,
             &contributorsLabel, &recipientsLabel, &additionalRecipientsLabel, &agreementsLabel })
    {
        styleLabel(*label, palette);
    }
    styleLabel(reviewSummaryTitleLabel, palette);

    baseUrlEditor.setText(processor.getApiClient().getBaseUrl(), juce::dontSendNotification);
    styleEditor(baseUrlEditor, "https://app.splitsheetstudio.com", palette);
    emailEditor.setText(processor.getUserEmail(), juce::dontSendNotification);
    emailEditor.setInputRestrictions(256);
    styleEditor(emailEditor, "name@example.com", palette);
    passwordEditor.setPasswordCharacter('*');
    styleEditor(passwordEditor, "Password", palette);
    styleEditor(songTitleEditor, "Song title", palette);
    styleEditor(alternateTitleEditor, "Alternate title", palette);
    styleEditor(dateEditor, "YYYY-MM-DD", palette);
    styleEditor(sessionLocationEditor, "City, studio, or room", palette);
    styleEditor(iswcEditor, "ISWC", palette);
    styleEditor(isrcEditor, "ISRC", palette);
    styleEditor(notesEditor, "Session notes", palette, true);
    styleEditor(additionalRecipientOneEditor, "email@example.com", palette);
    styleEditor(additionalRecipientTwoEditor, "email@example.com", palette);

    dateEditor.setText(todayIso(), juce::dontSendNotification);

    songTitleEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    alternateTitleEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    dateEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    sessionLocationEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    iswcEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    isrcEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    notesEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    additionalRecipientOneEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };
    additionalRecipientTwoEditor.onTextChange = [this] { refreshReviewSummary(); refreshSubmitState(); };

    inviteToggle.setButtonText("Collect signatures by invite links instead of in-session signing");
    supersedesPreviousToggle.setButtonText("This split supersedes any previous draft for this song.");
    allPartiesAgreeToggle.setButtonText("All parties reviewed and agree to these splits.");
    styleToggle(inviteToggle, palette);
    styleToggle(supersedesPreviousToggle, palette);
    styleToggle(allPartiesAgreeToggle, palette);

    inviteToggle.setToggleState(true, juce::dontSendNotification);
    inviteToggle.onClick = [this] { refreshReviewSummary(); refreshSubmitState(); };
    supersedesPreviousToggle.onClick = [this] { refreshReviewSummary(); refreshSubmitState(); };
    allPartiesAgreeToggle.onClick = [this] { refreshReviewSummary(); refreshSubmitState(); };

    styleButton(settingsButton, palette);
    styleButton(readyButton, palette);
    styleButton(loginButton, palette, palette.accent, palette.card);
    styleButton(createAccountButton, palette);
    styleButton(forgotPasswordButton, palette);
    styleButton(updateDownloadButton, palette, palette.panel, palette.primaryText);
    styleButton(addContributorButton, palette);
    styleButton(setEqualSplitsButton, palette);
    styleButton(nextStepButton, palette);
    styleButton(submitButton, palette, palette.accent, palette.card);
    styleButton(logoutButton, palette);
    styleStepButton(songStepButton, true, palette);
    styleStepButton(contributorsStepButton, false, palette);
    styleStepButton(reviewStepButton, false, palette);

    themeSelector.addItem("Bronze", static_cast<int>(SplitSheetTheme::bronze));
    themeSelector.addItem("Paper Thin", static_cast<int>(SplitSheetTheme::paperThin));
    themeSelector.addItem("Denim", static_cast<int>(SplitSheetTheme::denim));
    themeSelector.addItem("Soft", static_cast<int>(SplitSheetTheme::soft));
    themeSelector.addItem("Speakeasy", static_cast<int>(SplitSheetTheme::speakeasy));
    themeSelector.addItem("Plush", static_cast<int>(SplitSheetTheme::plush));
    themeSelector.setSelectedId(static_cast<int>(currentTheme), juce::dontSendNotification);
    themeSelector.setTooltip("Choose your Split Sheet Studio skin");
    styleComboBox(themeSelector, "Choose skin", palette);
    themeSelector.onChange = [this]
    {
        applyTheme(static_cast<SplitSheetTheme>(themeSelector.getSelectedId()), true);
    };

    settingsButton.addListener(this);
    readyButton.addListener(this);
    loginButton.addListener(this);
    createAccountButton.addListener(this);
    forgotPasswordButton.addListener(this);
    updateDownloadButton.addListener(this);
    songStepButton.addListener(this);
    contributorsStepButton.addListener(this);
    reviewStepButton.addListener(this);
    addContributorButton.addListener(this);
    setEqualSplitsButton.addListener(this);
    nextStepButton.addListener(this);
    submitButton.addListener(this);
    logoutButton.addListener(this);

    for (auto* component : std::array<juce::Component*, 35>{
             &titleLabel, &subtitleLabel, &statusBadgeLabel, &statusLabel, &settingsButton,
             &baseUrlLabel, &baseUrlEditor, &readyButton, &emailLabel, &emailEditor,
             &passwordLabel, &passwordEditor, &loginButton, &createAccountButton,
             &forgotPasswordButton, &updateDownloadButton, &songStepButton,
             &contributorsStepButton, &reviewStepButton, &welcomeLabel, &songTitleLabel,
             &songTitleEditor, &alternateTitleLabel, &alternateTitleEditor, &dateLabel,
             &dateEditor, &sessionLocationLabel, &sessionLocationEditor, &iswcLabel,
             &iswcEditor, &isrcLabel, &isrcEditor, &notesLabel, &notesEditor, &themeSelector })
    {
        addAndMakeVisible(*component);
    }

    addAndMakeVisible(contributorsViewport);

    for (auto* component : std::array<juce::Component*, 15>{
             &contributorsLabel, &contributorsHintLabel, &totalsLabel, &addContributorButton,
             &setEqualSplitsButton, &nextStepButton, &recipientsLabel, &additionalRecipientsLabel,
             &agreementsLabel, &reviewSummaryTitleLabel, &reviewSummaryLabel,
             &additionalRecipientOneEditor, &additionalRecipientTwoEditor, &validationLabel, &updateNoticeLabel })
    {
        addAndMakeVisible(*component);
    }

    addAndMakeVisible(inviteToggle);
    addAndMakeVisible(supersedesPreviousToggle);
    addAndMakeVisible(allPartiesAgreeToggle);
    addAndMakeVisible(submitButton);
    addAndMakeVisible(logoutButton);

    buildContributorRow();

    songStepButton.setButtonText("01  SONG");
    contributorsStepButton.setButtonText("02  CONTRIBUTORS");
    reviewStepButton.setButtonText("03  REVIEW & SEND");
    settingsButton.setButtonText("Preferences");
    loginButton.setButtonText("SIGN IN");
    createAccountButton.setButtonText("CREATE ACCOUNT");
    forgotPasswordButton.setButtonText("FORGOT PASSWORD?");
    updateDownloadButton.setButtonText("DOWNLOAD UPDATE");
    nextStepButton.setButtonText("Continue  >");
    submitButton.setButtonText("Send Split Sheet  >");

    updateStatus("Ready to connect", palette.neutral);
    setResizable(true, false);
    setResizeLimits(loginMinEditorWidth, loginMinEditorHeight, maxEditorWidth, maxEditorHeight);
    setSize(defaultEditorWidth, defaultEditorHeight);

    if (backendScreenshotMode)
        populateDemoScreenshotState();
    else
    {
        checkForUpdates();
        restoreSessionIfNeeded();
    }

    refreshViewState();
    maybeGenerateBackendScreenshots();
}

SplitSheetStudioEditor::~SplitSheetStudioEditor()
{
    setLookAndFeel(nullptr);
    settingsButton.removeListener(this);
    readyButton.removeListener(this);
    loginButton.removeListener(this);
    createAccountButton.removeListener(this);
    forgotPasswordButton.removeListener(this);
    updateDownloadButton.removeListener(this);
    songStepButton.removeListener(this);
    contributorsStepButton.removeListener(this);
    reviewStepButton.removeListener(this);
    addContributorButton.removeListener(this);
    setEqualSplitsButton.removeListener(this);
    nextStepButton.removeListener(this);
    submitButton.removeListener(this);
    logoutButton.removeListener(this);

    for (auto& row : contributorRows)
    {
        row->clearSignatureButton->removeListener(this);
        row->removeButton->removeListener(this);
    }
}

void SplitSheetStudioEditor::applyTheme(SplitSheetTheme theme, bool persist)
{
    if (theme < SplitSheetTheme::bronze || theme > SplitSheetTheme::plush)
        theme = SplitSheetTheme::bronze;

    currentTheme = theme;
    palette = paletteForTheme(theme);
    premiumLookAndFeel->setPalette(palette);
    themeSelector.setSelectedId(static_cast<int>(theme), juce::dontSendNotification);
    restyleControls();

    if (persist)
        processor.setThemeKey(keyForTheme(theme));

    repaint();
    contributorsCanvas->repaint();
}

void SplitSheetStudioEditor::restyleControls()
{
    titleLabel.setColour(juce::Label::textColourId, palette.primaryText);
    subtitleLabel.setColour(juce::Label::textColourId, palette.secondaryText);
    statusLabel.setColour(juce::Label::textColourId, palette.secondaryText);
    statusBadgeLabel.setColour(juce::Label::textColourId, palette.primaryText);
    welcomeLabel.setColour(juce::Label::textColourId, palette.primaryText);
    contributorsHintLabel.setColour(juce::Label::textColourId, palette.secondaryText);
    totalsLabel.setColour(juce::Label::textColourId, palette.secondaryText);
    reviewSummaryLabel.setColour(juce::Label::textColourId, palette.secondaryText);
    validationLabel.setColour(juce::Label::textColourId, palette.secondaryText);
    updateNoticeLabel.setColour(juce::Label::textColourId, palette.accent);

    for (auto* label : std::array<juce::Label*, 15>{
             &baseUrlLabel, &emailLabel, &passwordLabel, &songTitleLabel, &alternateTitleLabel,
             &dateLabel, &sessionLocationLabel, &iswcLabel, &isrcLabel, &notesLabel,
             &contributorsLabel, &recipientsLabel, &additionalRecipientsLabel, &agreementsLabel,
             &reviewSummaryTitleLabel })
    {
        styleLabel(*label, palette);
    }

    styleEditor(baseUrlEditor, "https://app.splitsheetstudio.com", palette);
    styleEditor(emailEditor, "name@example.com", palette);
    styleEditor(passwordEditor, "Password", palette);
    styleEditor(songTitleEditor, "Song title", palette);
    styleEditor(alternateTitleEditor, "Alternate title", palette);
    styleEditor(dateEditor, "YYYY-MM-DD", palette);
    styleEditor(sessionLocationEditor, "City, studio, or room", palette);
    styleEditor(iswcEditor, "ISWC", palette);
    styleEditor(isrcEditor, "ISRC", palette);
    styleEditor(notesEditor, "Session notes", palette, true);
    styleEditor(additionalRecipientOneEditor, "email@example.com", palette);
    styleEditor(additionalRecipientTwoEditor, "email@example.com", palette);

    styleToggle(inviteToggle, palette);
    styleToggle(supersedesPreviousToggle, palette);
    styleToggle(allPartiesAgreeToggle, palette);
    for (auto& button : recipientButtons)
        styleToggle(*button, palette);

    styleButton(settingsButton, palette);
    styleButton(readyButton, palette);
    styleButton(loginButton, palette, palette.accent, palette.card);
    styleButton(createAccountButton, palette);
    styleButton(forgotPasswordButton, palette);
    styleButton(updateDownloadButton, palette, palette.panel, palette.primaryText);
    styleButton(addContributorButton, palette);
    styleButton(setEqualSplitsButton, palette);
    styleButton(nextStepButton, palette);
    styleButton(submitButton, palette, palette.accent, palette.card);
    styleButton(logoutButton, palette);
    styleStepButton(songStepButton, currentStep == Step::song, palette);
    styleStepButton(contributorsStepButton, currentStep == Step::contributors, palette);
    styleStepButton(reviewStepButton, currentStep == Step::review, palette);
    styleComboBox(themeSelector, "Choose skin", palette);

    for (auto& row : contributorRows)
    {
        row->titleLabel->setColour(juce::Label::textColourId, palette.primaryText);
        row->signatureLabel->setColour(juce::Label::textColourId, palette.secondaryText);
        styleEditor(*row->legalName, "Legal name", palette);
        styleComboBox(*row->role, "Role", palette);
        styleEditor(*row->address, "Address", palette);
        styleEditor(*row->phone, "Phone", palette);
        styleEditor(*row->email, "Email", palette);
        styleEditor(*row->pro, "PRO", palette);
        styleEditor(*row->ipi, "IPI #", palette);
        styleEditor(*row->publisherName, "Publisher name", palette);
        styleEditor(*row->publisherIpi, "Publisher IPI #", palette);
        styleEditor(*row->writerShare, "Writer share %", palette);
        styleEditor(*row->publisherShare, "Publisher share %", palette);
        styleEditor(*row->typedSignatureName, "Typed signature name", palette);
        row->signaturePad->setPalette(palette);
        styleButton(*row->clearSignatureButton, palette);
        styleButton(*row->removeButton, palette);
    }
}

void SplitSheetStudioEditor::paint(juce::Graphics& graphics)
{
    auto bounds = getLocalBounds().toFloat();
    graphics.fillAll(palette.background);

    if (!isAuthenticated())
    {
        juce::ColourGradient skinGradient(palette.panel.brighter(0.18f), bounds.getCentreX(), 0.0f,
                                           palette.background.darker(0.12f), bounds.getCentreX(), bounds.getBottom(), false);
        skinGradient.addColour(0.42, palette.panel);
        skinGradient.addColour(0.76, palette.card);
        graphics.setGradientFill(skinGradient);
        graphics.fillRoundedRectangle(bounds.reduced(10.0f), 16.0f);

        const auto skinTexture = textureForTheme(currentTheme);
        if (skinTexture.isValid())
        {
            graphics.saveState();
            graphics.setOpacity(palette.textureOpacity);
            graphics.drawImageWithin(skinTexture, 10, 10, getWidth() - 20, getHeight() - 20,
                                     juce::RectanglePlacement::fillDestination);
            graphics.restoreState();
        }

        graphics.setColour(palette.accent.withAlpha(0.035f));
        for (float y = 16.0f; y < bounds.getBottom() - 12.0f; y += 6.0f)
            graphics.drawHorizontalLine(static_cast<int>(y), 12.0f, bounds.getRight() - 12.0f);

        graphics.setColour(palette.accent.withAlpha(0.24f));
        juce::Path leftFacet;
        leftFacet.startNewSubPath(12.0f, 150.0f);
        leftFacet.lineTo(185.0f, 150.0f);
        leftFacet.lineTo(245.0f, bounds.getBottom() - 16.0f);
        graphics.strokePath(leftFacet, juce::PathStrokeType(1.0f));
        juce::Path rightFacet;
        rightFacet.startNewSubPath(bounds.getRight() - 12.0f, 150.0f);
        rightFacet.lineTo(bounds.getRight() - 185.0f, 150.0f);
        rightFacet.lineTo(bounds.getRight() - 245.0f, bounds.getBottom() - 16.0f);
        graphics.strokePath(rightFacet, juce::PathStrokeType(1.0f));

        graphics.setColour(palette.secondaryText.withAlpha(0.48f));
        graphics.drawRoundedRectangle(bounds.reduced(10.0f), 16.0f, 1.0f);
        auto topAccent = bounds.reduced(10.0f).removeFromTop(4.0f);
        juce::ColourGradient accentGradient(juce::Colour::fromRGB(255, 221, 178), topAccent.getX(), topAccent.getY(),
                                             juce::Colour::fromRGB(185, 111, 61), topAccent.getRight(), topAccent.getY(), false);
        graphics.setGradientFill(accentGradient);
        graphics.fillRoundedRectangle(topAccent, 3.0f);

        auto markArea = juce::Rectangle<float>(0.0f, 0.0f, 70.0f, 70.0f).withCentre(juce::Point<float>(bounds.getCentreX(), 54.0f));
        drawBrandMark(graphics, markArea, palette);
        graphics.setColour(palette.primaryText);
        graphics.setFont(juce::FontOptions(21.0f, juce::Font::bold));
        graphics.drawFittedText("S P L I T S H E E T   S T U D I O", juce::Rectangle<int>(130, 94, getWidth() - 260, 28), juce::Justification::centred, 1);
        graphics.setColour(palette.secondaryText);
        graphics.setFont(juce::FontOptions(10.0f, juce::Font::plain));
        graphics.drawFittedText("Rights Clarity for Music Projects", juce::Rectangle<int>(220, 124, getWidth() - 440, 18), juce::Justification::centred, 1);

        auto loginCard = juce::Rectangle<int>(0, 0, 520, updateAvailable ? 500 : 440).withCentre(juce::Point<int>(getWidth() / 2, updateAvailable ? 410 : 390));
        juce::ColourGradient cardGradient(palette.panel.brighter(0.12f), static_cast<float>(loginCard.getX()), static_cast<float>(loginCard.getY()),
                                          palette.card, static_cast<float>(loginCard.getRight()), static_cast<float>(loginCard.getBottom()), false);
        graphics.setGradientFill(cardGradient);
        graphics.fillRoundedRectangle(loginCard.toFloat(), 14.0f);
        graphics.setColour(palette.accent.withAlpha(0.68f));
        graphics.drawRoundedRectangle(loginCard.toFloat(), 14.0f, 1.0f);
        graphics.setColour(juce::Colours::black.withAlpha(0.32f));
        graphics.drawRoundedRectangle(loginCard.toFloat().translated(0.0f, 4.0f), 14.0f, 4.0f);

        graphics.setColour(palette.primaryText);
        graphics.setFont(juce::FontOptions(15.0f, juce::Font::bold));
        graphics.drawFittedText("S I G N   I N", juce::Rectangle<int>(loginCard.getX() + 32, loginCard.getY() + 22, loginCard.getWidth() - 64, 22), juce::Justification::centred, 1);
        graphics.setColour(palette.accent.withAlpha(0.5f));
        graphics.drawHorizontalLine(loginCard.getY() + 54, static_cast<float>(loginCard.getX() + 42), static_cast<float>(loginCard.getRight() - 42));
        graphics.drawHorizontalLine(loginCard.getY() + 301, static_cast<float>(loginCard.getX() + 38), static_cast<float>(getWidth() / 2 - 22));
        graphics.drawHorizontalLine(loginCard.getY() + 301, static_cast<float>(getWidth() / 2 + 22), static_cast<float>(loginCard.getRight() - 38));
        graphics.setColour(palette.primaryText.withAlpha(0.86f));
        graphics.setFont(juce::FontOptions(9.0f, juce::Font::bold));
        graphics.drawFittedText("OR", juce::Rectangle<int>(getWidth() / 2 - 18, loginCard.getY() + 292, 36, 18), juce::Justification::centred, 1);
        graphics.setColour(palette.accent.withAlpha(0.85f));
        graphics.setFont(juce::FontOptions(8.0f, juce::Font::bold));
        graphics.drawFittedText("BLAK MARIGOLD STUDIO  |  SESSION RIGHTS SYSTEM",
                                juce::Rectangle<int>(loginCard.getX() + 30, loginCard.getBottom() - 25, loginCard.getWidth() - 60, 14),
                                juce::Justification::centred, 1);
        return;
    }

    juce::ColourGradient gradient(palette.panel, bounds.getX(), bounds.getY(),
                                  palette.background, bounds.getRight(), bounds.getBottom(),
                                  false);
    graphics.setGradientFill(gradient);
    graphics.fillRoundedRectangle(bounds.reduced(10.0f), 16.0f);

    const auto skinTexture = textureForTheme(currentTheme);
    if (skinTexture.isValid())
    {
        graphics.saveState();
        graphics.setOpacity(palette.textureOpacity * 0.72f);
        graphics.drawImageWithin(skinTexture, 10, 10, getWidth() - 20, getHeight() - 20,
                                 juce::RectanglePlacement::fillDestination);
        graphics.restoreState();
    }

    graphics.setColour(palette.secondaryText.withAlpha(0.42f));
    graphics.drawRoundedRectangle(bounds.reduced(10.0f), 16.0f, 1.0f);

    auto topAccent = bounds.reduced(10.0f).removeFromTop(5.0f);
    graphics.setColour(palette.accent);
    graphics.fillRoundedRectangle(topAccent.removeFromLeft(318.0f), 3.0f);

    drawBrandMark(graphics, juce::Rectangle<float>(26.0f, 23.0f, 44.0f, 44.0f), palette);
    graphics.setColour(palette.secondaryText.withAlpha(0.7f));
    graphics.setFont(juce::FontOptions(8.0f, juce::Font::bold));
    graphics.drawFittedText("BLAK MARIGOLD STUDIO  |  SESSION RIGHTS SYSTEM",
                            juce::Rectangle<int>(getWidth() - 330, 26, 300, 14),
                            juce::Justification::centredRight, 1);
    graphics.setColour(palette.secondaryText.withAlpha(0.18f));
    graphics.drawHorizontalLine(80, 24.0f, static_cast<float>(getWidth() - 24));

    auto contentArea = getLocalBounds().reduced(24);
    contentArea.removeFromTop(168 + (settingsVisible ? 68 : 0));
    contentArea.removeFromBottom(58);
    graphics.setColour(palette.section.withAlpha(0.91f));
    graphics.fillRoundedRectangle(contentArea.toFloat(), 14.0f);
    graphics.setColour(palette.secondaryText.withAlpha(0.22f));
    graphics.drawRoundedRectangle(contentArea.toFloat(), 14.0f, 1.0f);
}

void SplitSheetStudioEditor::resized()
{
    if (!isAuthenticated())
    {
        themeSelector.setBounds(getWidth() - 142, 26, 108, 28);
        auto loginCard = juce::Rectangle<int>(0, 0, 520, 440).withCentre(juce::Point<int>(getWidth() / 2, 390));
        auto loginArea = loginCard.reduced(32);
        loginArea.removeFromTop(58);

        emailLabel.setBounds(loginArea.removeFromTop(18));
        loginArea.removeFromTop(4);
        emailEditor.setBounds(loginArea.removeFromTop(38));
        loginArea.removeFromTop(12);

        passwordLabel.setBounds(loginArea.removeFromTop(18));
        loginArea.removeFromTop(4);
        passwordEditor.setBounds(loginArea.removeFromTop(38));
        loginArea.removeFromTop(16);

        loginButton.setBounds(loginArea.removeFromTop(46));
        loginArea.removeFromTop(34);
        createAccountButton.setBounds(loginArea.removeFromTop(38));
        loginArea.removeFromTop(8);
        forgotPasswordButton.setBounds(loginArea.removeFromTop(38));
        if (updateAvailable)
        {
            loginArea.removeFromTop(14);
            updateNoticeLabel.setBounds(loginArea.removeFromTop(22));
            loginArea.removeFromTop(6);
            updateDownloadButton.setBounds(loginArea.removeFromTop(34));
        }
        return;
    }

    auto area = getLocalBounds().reduced(24);
    auto header = area.removeFromTop(58);
    header.removeFromLeft(58);
    titleLabel.setBounds(header.removeFromTop(28));
    subtitleLabel.setBounds(header.removeFromTop(18));
    area.removeFromTop(8);

    auto statusRow = area.removeFromTop(28);
    statusBadgeLabel.setBounds(statusRow.removeFromLeft(92));
    statusRow.removeFromLeft(10);
    settingsButton.setBounds(statusRow.removeFromRight(170));
    statusRow.removeFromRight(8);
    themeSelector.setBounds(statusRow.removeFromRight(108));
    statusRow.removeFromRight(10);
    if (updateAvailable)
    {
        updateDownloadButton.setBounds(statusRow.removeFromRight(150));
        statusRow.removeFromRight(10);
    }
    statusLabel.setBounds(statusRow);
    updateNoticeLabel.setBounds(area.removeFromTop(updateAvailable ? 22 : 0));
    if (updateAvailable)
        area.removeFromTop(6);
    area.removeFromTop(10);

    if (settingsVisible)
    {
        auto settingsRow = area.removeFromTop(58);
        auto labelArea = settingsRow.removeFromLeft(150);
        baseUrlLabel.setBounds(labelArea.removeFromTop(20));
        settingsRow.removeFromLeft(8);
        readyButton.setBounds(settingsRow.removeFromRight(150));
        settingsRow.removeFromRight(10);
        baseUrlEditor.setBounds(settingsRow.removeFromTop(32));
        area.removeFromTop(10);
    }

    auto tabRow = area.removeFromTop(34);
    songStepButton.setBounds(tabRow.removeFromLeft(130));
    tabRow.removeFromLeft(8);
    contributorsStepButton.setBounds(tabRow.removeFromLeft(178));
    tabRow.removeFromLeft(8);
    reviewStepButton.setBounds(tabRow.removeFromLeft(190));
    area.removeFromTop(12);

    welcomeLabel.setBounds(area.removeFromTop(24));
    area.removeFromTop(10);

    auto footer = area.removeFromBottom(48);
    validationLabel.setBounds(footer.removeFromLeft(getWidth() - 280));
    footer.removeFromLeft(12);
    if (currentStep == Step::review)
    {
        submitButton.setBounds(footer.removeFromLeft(190));
        footer.removeFromLeft(12);
    }
    else
    {
        nextStepButton.setBounds(footer.removeFromLeft(190));
        footer.removeFromLeft(12);
    }
    logoutButton.setBounds(footer.removeFromLeft(140));

    auto contentArea = area;

    switch (currentStep)
    {
        case Step::song:
        {
            auto row1 = contentArea.removeFromTop(58);
            auto songTitleArea = row1.removeFromLeft(440);
            songTitleLabel.setBounds(songTitleArea.removeFromTop(20));
            songTitleArea.removeFromTop(4);
            songTitleEditor.setBounds(songTitleArea.removeFromTop(32));
            row1.removeFromLeft(16);
            auto dateArea = row1.removeFromLeft(180);
            dateLabel.setBounds(dateArea.removeFromTop(20));
            dateArea.removeFromTop(4);
            dateEditor.setBounds(dateArea.removeFromTop(32));
            contentArea.removeFromTop(12);

            auto row2 = contentArea.removeFromTop(58);
            auto alternateArea = row2.removeFromLeft(440);
            alternateTitleLabel.setBounds(alternateArea.removeFromTop(20));
            alternateArea.removeFromTop(4);
            alternateTitleEditor.setBounds(alternateArea.removeFromTop(32));
            row2.removeFromLeft(16);
            auto locationArea = row2.removeFromLeft(300);
            sessionLocationLabel.setBounds(locationArea.removeFromTop(20));
            locationArea.removeFromTop(4);
            sessionLocationEditor.setBounds(locationArea.removeFromTop(32));
            contentArea.removeFromTop(12);

            auto row3 = contentArea.removeFromTop(58);
            auto iswcArea = row3.removeFromLeft(280);
            iswcLabel.setBounds(iswcArea.removeFromTop(20));
            iswcArea.removeFromTop(4);
            iswcEditor.setBounds(iswcArea.removeFromTop(32));
            row3.removeFromLeft(16);
            auto isrcArea = row3.removeFromLeft(280);
            isrcLabel.setBounds(isrcArea.removeFromTop(20));
            isrcArea.removeFromTop(4);
            isrcEditor.setBounds(isrcArea.removeFromTop(32));
            contentArea.removeFromTop(12);

            notesLabel.setBounds(contentArea.removeFromTop(20));
            contentArea.removeFromTop(4);
            notesEditor.setBounds(contentArea.removeFromTop(104));
            break;
        }

        case Step::contributors:
        {
            auto headerRow = contentArea.removeFromTop(26);
            contributorsLabel.setBounds(headerRow.removeFromLeft(160));
            setEqualSplitsButton.setBounds(headerRow.removeFromRight(150));
            headerRow.removeFromRight(10);
            addContributorButton.setBounds(headerRow.removeFromRight(150));
            contentArea.removeFromTop(6);
            contributorsHintLabel.setBounds(contentArea.removeFromTop(18));
            contentArea.removeFromTop(6);
            totalsLabel.setBounds(contentArea.removeFromTop(18));
            contentArea.removeFromTop(10);
            contributorsViewport.setBounds(contentArea);
            refreshContributorCanvas();
            break;
        }

        case Step::review:
        {
            recipientsLabel.setBounds(contentArea.removeFromTop(20));
            contentArea.removeFromTop(6);

            for (auto& button : recipientButtons)
            {
                if (!button->isVisible())
                    continue;

                button->setBounds(contentArea.removeFromTop(24));
                contentArea.removeFromTop(4);
            }

            contentArea.removeFromTop(6);
            additionalRecipientsLabel.setBounds(contentArea.removeFromTop(20));
            contentArea.removeFromTop(4);

            auto recipientRow = contentArea.removeFromTop(32);
            additionalRecipientOneEditor.setBounds(recipientRow.removeFromLeft(320));
            recipientRow.removeFromLeft(12);
            additionalRecipientTwoEditor.setBounds(recipientRow.removeFromLeft(320));
            contentArea.removeFromTop(14);

            agreementsLabel.setBounds(contentArea.removeFromTop(20));
            contentArea.removeFromTop(6);
            inviteToggle.setBounds(contentArea.removeFromTop(24));
            contentArea.removeFromTop(4);
            supersedesPreviousToggle.setBounds(contentArea.removeFromTop(24));
            contentArea.removeFromTop(4);
            allPartiesAgreeToggle.setBounds(contentArea.removeFromTop(24));
            contentArea.removeFromTop(16);

            reviewSummaryTitleLabel.setBounds(contentArea.removeFromTop(20));
            contentArea.removeFromTop(6);
            reviewSummaryLabel.setBounds(contentArea.removeFromTop(180));
            break;
        }
    }
}

void SplitSheetStudioEditor::buttonClicked(juce::Button* button)
{
    if (button == &settingsButton)
    {
        toggleSettings();
        return;
    }

    if (button == &readyButton)
    {
        juce::Component::SafePointer<SplitSheetStudioEditor> safeThis(this);
        processor.getApiClient().setBaseUrl(baseUrlEditor.getText());
        updateStatus("Checking connection...", palette.warning);
        setBusy(true);

        processor.getApiClient().fetchReady([safeThis](SplitSheetApiClient::ReadyResponse response)
        {
            if (safeThis == nullptr)
                return;

            auto& editor = *safeThis;
            editor.updateStatus(response.ok ? "Connection is ready." : "Could not reach SplitSheet.",
                                response.ok ? editor.palette.success : editor.palette.error);
            editor.setBusy(false);
        });
        return;
    }

    if (button == &loginButton)
    {
        runLogin();
        return;
    }

    if (button == &createAccountButton || button == &forgotPasswordButton)
    {
        const auto accountUrl = processor.getApiClient().getBaseUrl() + (button == &createAccountButton ? "/signup" : "/forgot-password");
        juce::URL(accountUrl).launchInDefaultBrowser();
        return;
    }

    if (button == &updateDownloadButton)
    {
        if (updateDownloadUrl.isNotEmpty())
            juce::URL(updateDownloadUrl).launchInDefaultBrowser();
        return;
    }

    if (button == &songStepButton)
    {
        switchStep(Step::song);
        return;
    }

    if (button == &contributorsStepButton)
    {
        switchStep(Step::contributors);
        return;
    }

    if (button == &reviewStepButton)
    {
        switchStep(Step::review);
        return;
    }

    if (button == &addContributorButton)
    {
        buildContributorRow();
        resized();
        repaint();
        return;
    }

    if (button == &setEqualSplitsButton)
    {
        if (contributorRows.empty())
            return;

        const auto rowCount = static_cast<int>(contributorRows.size());
        double remainingWriter = 100.0;
        double remainingPublisher = 100.0;

        for (int index = 0; index < rowCount; ++index)
        {
            const bool last = index == rowCount - 1;
            const double writer = last ? remainingWriter : std::round((10000.0 / rowCount)) / 100.0;
            const double publisher = last ? remainingPublisher : std::round((10000.0 / rowCount)) / 100.0;
            contributorRows[static_cast<size_t>(index)]->writerShare->setText(juce::String(writer, 2), juce::dontSendNotification);
            contributorRows[static_cast<size_t>(index)]->publisherShare->setText(juce::String(publisher, 2), juce::dontSendNotification);
            remainingWriter -= writer;
            remainingPublisher -= publisher;
        }

        refreshReviewSummary();
        refreshSubmitState();
        return;
    }

    if (button == &nextStepButton)
    {
        if (currentStep == Step::song)
            switchStep(Step::contributors);
        else if (currentStep == Step::contributors)
            switchStep(Step::review);
        return;
    }

    if (button == &submitButton)
    {
        submitSplitSheet();
        return;
    }

    if (button == &logoutButton)
    {
        runLogout();
        return;
    }

    for (int index = 0; index < static_cast<int>(contributorRows.size()); ++index)
    {
        auto& row = contributorRows[static_cast<size_t>(index)];
        if (button == row->removeButton.get())
        {
            removeContributorRow(index);
            return;
        }

        if (button == row->clearSignatureButton.get())
        {
            row->signaturePad->clear();
            return;
        }
    }
}

void SplitSheetStudioEditor::buildContributorRow()
{
    auto row = std::make_unique<ContributorRow>();
    row->titleLabel = std::make_unique<juce::Label>();
    row->legalName = std::make_unique<juce::TextEditor>();
    row->role = std::make_unique<juce::ComboBox>();
    row->address = std::make_unique<juce::TextEditor>();
    row->phone = std::make_unique<juce::TextEditor>();
    row->email = std::make_unique<juce::TextEditor>();
    row->pro = std::make_unique<juce::TextEditor>();
    row->ipi = std::make_unique<juce::TextEditor>();
    row->publisherName = std::make_unique<juce::TextEditor>();
    row->publisherIpi = std::make_unique<juce::TextEditor>();
    row->writerShare = std::make_unique<juce::TextEditor>();
    row->publisherShare = std::make_unique<juce::TextEditor>();
    row->typedSignatureName = std::make_unique<juce::TextEditor>();
    row->signatureLabel = std::make_unique<juce::Label>();
    row->signaturePad = std::make_unique<SignaturePad>([this]
    {
        refreshReviewSummary();
        refreshSubmitState();
    });
    row->clearSignatureButton = std::make_unique<juce::TextButton>("Clear Signature");
    row->removeButton = std::make_unique<juce::TextButton>("X");

    row->titleLabel->setJustificationType(juce::Justification::centredLeft);
    row->titleLabel->setColour(juce::Label::textColourId, palette.primaryText);
    row->titleLabel->setFont(juce::FontOptions(13.5f, juce::Font::bold));

    row->signatureLabel->setText("Draw signature", juce::dontSendNotification);
    styleLabel(*row->signatureLabel, palette, 12.5f, true);
    row->signatureLabel->setColour(juce::Label::textColourId, palette.secondaryText);

    styleEditor(*row->legalName, "Legal name", palette);
    styleComboBox(*row->role, "Role", palette);
    row->role->addItem("Writer", 1);
    row->role->addItem("Producer", 2);
    row->role->addItem("Artist", 3);
    row->role->addItem("Composer", 4);
    row->role->addItem("Songwriter", 5);
    row->role->addItem("Other", 6);
    styleEditor(*row->address, "Address", palette);
    styleEditor(*row->phone, "Phone", palette);
    styleEditor(*row->email, "Email", palette);
    styleEditor(*row->pro, "PRO", palette);
    styleEditor(*row->ipi, "IPI #", palette);
    styleEditor(*row->publisherName, "Publisher name", palette);
    styleEditor(*row->publisherIpi, "Publisher IPI #", palette);
    styleEditor(*row->writerShare, "Writer share %", palette);
    styleEditor(*row->publisherShare, "Publisher share %", palette);
    styleEditor(*row->typedSignatureName, "Typed signature name", palette);
    row->signaturePad->setPalette(palette);

    row->writerShare->setInputRestrictions(6, "0123456789.");
    row->publisherShare->setInputRestrictions(6, "0123456789.");

    auto onChange = [this]
    {
        refreshRecipientButtons();
        refreshReviewSummary();
        refreshSubmitState();
    };

    row->legalName->onTextChange = onChange;
    row->role->onChange = onChange;
    row->address->onTextChange = onChange;
    row->phone->onTextChange = onChange;
    row->email->onTextChange = onChange;
    row->pro->onTextChange = onChange;
    row->ipi->onTextChange = onChange;
    row->publisherName->onTextChange = onChange;
    row->publisherIpi->onTextChange = onChange;
    row->writerShare->onTextChange = onChange;
    row->publisherShare->onTextChange = onChange;
    row->typedSignatureName->onTextChange = onChange;

    styleButton(*row->clearSignatureButton, palette);
    styleButton(*row->removeButton, palette);
    row->clearSignatureButton->addListener(this);
    row->removeButton->addListener(this);

    for (auto* component : std::array<juce::Component*, 16>{
             row->titleLabel.get(), row->legalName.get(), row->role.get(), row->address.get(),
             row->phone.get(), row->email.get(), row->pro.get(), row->ipi.get(),
             row->publisherName.get(), row->publisherIpi.get(), row->writerShare.get(),
             row->publisherShare.get(), row->typedSignatureName.get(), row->signatureLabel.get(),
             row->signaturePad.get(), row->clearSignatureButton.get() })
    {
        contributorsCanvas->addAndMakeVisible(*component);
    }

    contributorsCanvas->addAndMakeVisible(*row->removeButton);

    contributorRows.push_back(std::move(row));
    recipientSelections.push_back(true);
    updateContributorTitles();
    refreshRecipientButtons();
    refreshContributorCanvas();
    refreshSubmitState();
}

void SplitSheetStudioEditor::removeContributorRow(int index)
{
    if (contributorRows.size() <= 1 || index < 0 || index >= static_cast<int>(contributorRows.size()))
        return;

    contributorRows[static_cast<size_t>(index)]->clearSignatureButton->removeListener(this);
    contributorRows[static_cast<size_t>(index)]->removeButton->removeListener(this);
    contributorRows.erase(contributorRows.begin() + index);
    recipientSelections.erase(recipientSelections.begin() + index);
    updateContributorTitles();
    refreshRecipientButtons();
    refreshContributorCanvas();
    refreshReviewSummary();
    refreshSubmitState();
    resized();
    repaint();
}

void SplitSheetStudioEditor::refreshViewState()
{
    const auto authed = isAuthenticated();
    const auto minWidth = authed ? authedMinEditorWidth : loginMinEditorWidth;
    const auto minHeight = authed ? authedMinEditorHeight : (updateAvailable ? loginUpdateMinEditorHeight : loginMinEditorHeight);
    setResizeLimits(minWidth, minHeight, maxEditorWidth, maxEditorHeight);

    const auto targetWidth = juce::jmax(getWidth(), minWidth);
    const auto targetHeight = juce::jmax(getHeight(), minHeight);
    if (targetWidth != getWidth() || targetHeight != getHeight())
        setSize(targetWidth, targetHeight);

    titleLabel.setVisible(authed);
    subtitleLabel.setVisible(authed);
    statusBadgeLabel.setVisible(authed);
    statusLabel.setVisible(authed);
    settingsButton.setVisible(authed);
    baseUrlLabel.setVisible(authed && settingsVisible);
    baseUrlEditor.setVisible(authed && settingsVisible);
    readyButton.setVisible(authed && settingsVisible);

    emailLabel.setVisible(!authed);
    emailEditor.setVisible(!authed);
    passwordLabel.setVisible(!authed);
    passwordEditor.setVisible(!authed);
    loginButton.setVisible(!authed);
    createAccountButton.setVisible(!authed);
    forgotPasswordButton.setVisible(!authed);
    updateNoticeLabel.setVisible(updateAvailable);
    updateDownloadButton.setVisible(updateAvailable);
    themeSelector.setVisible(true);

    songStepButton.setVisible(authed);
    contributorsStepButton.setVisible(authed);
    reviewStepButton.setVisible(authed);
    welcomeLabel.setVisible(authed);
    validationLabel.setVisible(authed);
    logoutButton.setVisible(authed);
    nextStepButton.setVisible(authed && currentStep != Step::review);
    submitButton.setVisible(authed && currentStep == Step::review);

    const auto showSong = authed && currentStep == Step::song;
    const auto showContributors = authed && currentStep == Step::contributors;
    const auto showReview = authed && currentStep == Step::review;

    songTitleLabel.setVisible(showSong);
    songTitleEditor.setVisible(showSong);
    alternateTitleLabel.setVisible(showSong);
    alternateTitleEditor.setVisible(showSong);
    dateLabel.setVisible(showSong);
    dateEditor.setVisible(showSong);
    sessionLocationLabel.setVisible(showSong);
    sessionLocationEditor.setVisible(showSong);
    iswcLabel.setVisible(showSong);
    iswcEditor.setVisible(showSong);
    isrcLabel.setVisible(showSong);
    isrcEditor.setVisible(showSong);
    notesLabel.setVisible(showSong);
    notesEditor.setVisible(showSong);

    contributorsLabel.setVisible(showContributors);
    contributorsHintLabel.setVisible(showContributors);
    totalsLabel.setVisible(showContributors);
    addContributorButton.setVisible(showContributors);
    setEqualSplitsButton.setVisible(showContributors);
    contributorsViewport.setVisible(showContributors);

    for (auto& row : contributorRows)
    {
        row->titleLabel->setVisible(showContributors);
        row->legalName->setVisible(showContributors);
        row->role->setVisible(showContributors);
        row->address->setVisible(showContributors);
        row->phone->setVisible(showContributors);
        row->email->setVisible(showContributors);
        row->pro->setVisible(showContributors);
        row->ipi->setVisible(showContributors);
        row->publisherName->setVisible(showContributors);
        row->publisherIpi->setVisible(showContributors);
        row->writerShare->setVisible(showContributors);
        row->publisherShare->setVisible(showContributors);
        row->typedSignatureName->setVisible(showContributors);
        row->signatureLabel->setVisible(showContributors);
        row->signaturePad->setVisible(showContributors);
        row->clearSignatureButton->setVisible(showContributors);
        row->removeButton->setVisible(showContributors && contributorRows.size() > 1 && row.get() != contributorRows.front().get());
    }

    recipientsLabel.setVisible(showReview);
    additionalRecipientsLabel.setVisible(showReview);
    agreementsLabel.setVisible(showReview);
    inviteToggle.setVisible(showReview);
    supersedesPreviousToggle.setVisible(showReview);
    allPartiesAgreeToggle.setVisible(showReview);
    reviewSummaryTitleLabel.setVisible(showReview);
    reviewSummaryLabel.setVisible(showReview);
    additionalRecipientOneEditor.setVisible(showReview);
    additionalRecipientTwoEditor.setVisible(showReview);

    for (size_t index = 0; index < recipientButtons.size(); ++index)
        recipientButtons[index]->setVisible(showReview && index < contributorRows.size());

    if (authed)
        populateSignedInDefaults();

    updateStepButtons();
    nextStepButton.setButtonText(currentStep == Step::song ? "Next: Contributors" : "Next: Review");
    refreshRecipientButtons();
    refreshReviewSummary();
    refreshSubmitState();
    resized();
    repaint();
}

void SplitSheetStudioEditor::checkForUpdates()
{
    juce::Component::SafePointer<SplitSheetStudioEditor> safeThis(this);
    processor.getApiClient().setBaseUrl(baseUrlEditor.getText());
    processor.getApiClient().fetchPluginUpdate(currentPluginVersion, [safeThis](SplitSheetApiClient::PluginUpdateResponse response)
    {
        if (safeThis == nullptr)
            return;

        auto& editor = *safeThis;
        editor.updateAvailable = response.ok && response.updateAvailable;
        editor.updateDownloadUrl = response.downloadUrl;

        if (editor.updateAvailable)
        {
            const juce::String prefix = response.updateRequired ? "Required update: " : "Update available: ";
            const juce::String version = response.latestVersion.isNotEmpty() ? response.latestVersion : "latest";
            editor.updateNoticeLabel.setText(prefix + "Split Sheet Studio " + version, juce::dontSendNotification);
            editor.updateDownloadButton.setButtonText(response.updateRequired ? "UPDATE REQUIRED" : "DOWNLOAD UPDATE");
            editor.updateStatus(prefix + version, response.updateRequired ? editor.palette.error : editor.palette.warning);
        }
        else
        {
            editor.updateNoticeLabel.setText({}, juce::dontSendNotification);
        }

        editor.refreshViewState();
    });
}

void SplitSheetStudioEditor::restoreSessionIfNeeded()
{
    if (processor.getRefreshToken().isEmpty())
        return;

    restoringSession = true;
    updateStatus("Restoring session...", palette.warning);
    setBusy(true);

    juce::Component::SafePointer<SplitSheetStudioEditor> safeThis(this);
    processor.getApiClient().refreshSession(processor.getRefreshToken(),
                                            [safeThis](SplitSheetApiClient::LoginResponse response)
    {
        if (safeThis == nullptr)
            return;

        auto& editor = *safeThis;
        editor.restoringSession = false;

        if (response.ok)
        {
            editor.processor.setAccessToken(response.accessToken);
            editor.processor.setRefreshToken(response.refreshToken);
            editor.processor.setUserEmail(response.userEmail);
            editor.processor.setDisplayName(response.displayName);
            editor.updateStatus("Signed in as " + (response.displayName.isNotEmpty() ? response.displayName : response.userEmail),
                                editor.palette.success);
        }
        else
        {
            editor.processor.clearSession();
            editor.updateStatus("Sign in to continue.", editor.palette.neutral);
        }

        editor.setBusy(false);
        editor.refreshViewState();
    });
}

void SplitSheetStudioEditor::runLogin()
{
    processor.getApiClient().setBaseUrl(baseUrlEditor.getText());
    updateStatus("Signing in...", palette.warning);
    setBusy(true);

    juce::Component::SafePointer<SplitSheetStudioEditor> safeThis(this);
    processor.getApiClient().login(emailEditor.getText(), passwordEditor.getText(),
                                   [safeThis](SplitSheetApiClient::LoginResponse response)
    {
        if (safeThis == nullptr)
            return;

        auto& editor = *safeThis;
        if (response.ok)
        {
            editor.processor.setAccessToken(response.accessToken);
            editor.processor.setRefreshToken(response.refreshToken);
            editor.processor.setUserEmail(response.userEmail);
            editor.processor.setDisplayName(response.displayName);
            editor.passwordEditor.clear();
            editor.updateStatus("Signed in as " + (response.displayName.isNotEmpty() ? response.displayName : response.userEmail),
                                editor.palette.success);
            editor.refreshViewState();
        }
        else
        {
            editor.updateStatus(response.errorMessage.isNotEmpty() ? response.errorMessage : "Sign in failed",
                                editor.palette.error);
        }

        editor.setBusy(false);
    });
}

void SplitSheetStudioEditor::runLogout()
{
    const auto refreshToken = processor.getRefreshToken();
    processor.clearSession();
    refreshViewState();
    updateStatus("Signed out.", palette.neutral);

    if (refreshToken.isEmpty())
        return;

    processor.getApiClient().logout(refreshToken, [] {});
}

void SplitSheetStudioEditor::submitSplitSheet()
{
    const auto message = validationMessage();
    if (message.isNotEmpty())
    {
        refreshSubmitState();
        return;
    }

    updateStatus("Sending split sheet...", palette.warning);
    setBusy(true);

    const auto payload = buildSubmissionPayload();
    juce::Component::SafePointer<SplitSheetStudioEditor> safeThis(this);
    processor.getApiClient().createSplitSheet(processor.getAccessToken(), payload,
                                              [safeThis](SplitSheetApiClient::SplitSheetResponse response)
    {
        if (safeThis == nullptr)
            return;

        auto& editor = *safeThis;
        if (response.ok)
        {
            editor.updateStatus("Split sheet sent for " + response.songTitle, editor.palette.success);
            editor.resetForm();
        }
        else
        {
            editor.updateStatus(response.errorMessage.isNotEmpty() ? response.errorMessage : "Could not send split sheet",
                                editor.palette.error);
        }

        editor.setBusy(false);
    });
}

void SplitSheetStudioEditor::updateStatus(juce::String message, juce::Colour colour)
{
    processor.setStatusText(message);
    statusLabel.setText(message, juce::dontSendNotification);
    statusBadgeLabel.setColour(juce::Label::backgroundColourId, colour);
    repaint();
}

void SplitSheetStudioEditor::setBusy(bool busy)
{
    settingsButton.setEnabled(!busy);
    readyButton.setEnabled(!busy);
    loginButton.setEnabled(!busy);
    createAccountButton.setEnabled(!busy);
    forgotPasswordButton.setEnabled(!busy);
    songStepButton.setEnabled(!busy);
    contributorsStepButton.setEnabled(!busy);
    reviewStepButton.setEnabled(!busy);
    addContributorButton.setEnabled(!busy);
    setEqualSplitsButton.setEnabled(!busy);
    nextStepButton.setEnabled(!busy);
    logoutButton.setEnabled(!busy);

    for (auto& row : contributorRows)
    {
        row->removeButton->setEnabled(!busy);
        row->clearSignatureButton->setEnabled(!busy);
        row->signaturePad->setEnabled(!busy);
    }

    if (!busy)
        refreshSubmitState();
    else
        submitButton.setEnabled(false);
}

void SplitSheetStudioEditor::toggleSettings()
{
    settingsVisible = !settingsVisible;
    settingsButton.setButtonText(settingsVisible ? "Hide Preferences" : "Preferences");
    refreshViewState();
}

void SplitSheetStudioEditor::switchStep(Step step)
{
    currentStep = step;
    refreshViewState();
}

void SplitSheetStudioEditor::updateStepButtons()
{
    styleStepButton(songStepButton, currentStep == Step::song, palette);
    styleStepButton(contributorsStepButton, currentStep == Step::contributors, palette);
    styleStepButton(reviewStepButton, currentStep == Step::review, palette);
}

void SplitSheetStudioEditor::updateContributorTitles()
{
    for (int index = 0; index < static_cast<int>(contributorRows.size()); ++index)
    {
        contributorRows[static_cast<size_t>(index)]->titleLabel->setText("Contributor " + juce::String(index + 1),
                                                                         juce::dontSendNotification);
        contributorRows[static_cast<size_t>(index)]->removeButton->setVisible(index > 0);
    }
}

void SplitSheetStudioEditor::refreshContributorCanvas()
{
    totalsLabel.setText("Writer total: " + formatPercent(writerTotal()) + "   |   Publisher total: " + formatPercent(publisherTotal()),
                        juce::dontSendNotification);

    if (!contributorsViewport.isVisible())
        return;

    contributorCardBounds.clear();
    const auto canvasWidth = juce::jmax(720, contributorsViewport.getWidth() - 14);
    int y = 8;

    for (auto& row : contributorRows)
    {
        juce::Rectangle<int> card(8, y, canvasWidth - 16, 372);
        contributorCardBounds.push_back(card);

        auto inner = card.reduced(14);
        auto titleRow = inner.removeFromTop(24);
        row->titleLabel->setBounds(titleRow.removeFromLeft(180));
        row->removeButton->setBounds(titleRow.removeFromRight(34));
        inner.removeFromTop(8);

        auto row1 = inner.removeFromTop(30);
        row->legalName->setBounds(row1.removeFromLeft((inner.getWidth() - 12) / 2));
        row1.removeFromLeft(12);
        row->role->setBounds(row1);
        inner.removeFromTop(8);

        auto row2 = inner.removeFromTop(30);
        row->address->setBounds(row2.removeFromLeft((inner.getWidth() - 12) / 2));
        row2.removeFromLeft(12);
        row->phone->setBounds(row2);
        inner.removeFromTop(8);

        auto row3 = inner.removeFromTop(30);
        row->email->setBounds(row3.removeFromLeft((inner.getWidth() - 12) / 2));
        row3.removeFromLeft(12);
        row->pro->setBounds(row3);
        inner.removeFromTop(8);

        auto row4 = inner.removeFromTop(30);
        row->ipi->setBounds(row4.removeFromLeft((inner.getWidth() - 12) / 2));
        row4.removeFromLeft(12);
        row->publisherName->setBounds(row4);
        inner.removeFromTop(8);

        auto row5 = inner.removeFromTop(30);
        row->publisherIpi->setBounds(row5.removeFromLeft((inner.getWidth() - 12) / 2));
        row5.removeFromLeft(12);
        row->writerShare->setBounds(row5);
        inner.removeFromTop(8);

        auto row6 = inner.removeFromTop(30);
        row->publisherShare->setBounds(row6.removeFromLeft(180));
        row6.removeFromLeft(12);
        row->typedSignatureName->setBounds(row6);
        inner.removeFromTop(8);

        auto signatureRow = inner.removeFromTop(18);
        row->signatureLabel->setBounds(signatureRow.removeFromLeft(120));
        row->clearSignatureButton->setBounds(signatureRow.removeFromRight(140));
        inner.removeFromTop(6);
        row->signaturePad->setBounds(inner.removeFromTop(128));

        y += card.getHeight() + 12;
    }

    contributorsCanvas->setSize(canvasWidth, y + 8);
    contributorsCanvas->repaint();
}

void SplitSheetStudioEditor::refreshRecipientButtons()
{
    if (recipientSelections.size() < contributorRows.size())
        recipientSelections.resize(contributorRows.size(), true);

    while (recipientButtons.size() < contributorRows.size())
    {
        auto button = std::make_unique<juce::ToggleButton>();
        styleToggle(*button, palette);
        const auto index = recipientButtons.size();
        button->onClick = [this, index]
        {
            if (index < recipientSelections.size())
                recipientSelections[index] = recipientButtons[index]->getToggleState();

            refreshReviewSummary();
            refreshSubmitState();
        };
        addAndMakeVisible(*button);
        recipientButtons.push_back(std::move(button));
    }

    for (size_t index = 0; index < recipientButtons.size(); ++index)
    {
        auto& button = recipientButtons[index];
        if (index >= contributorRows.size())
        {
            button->setVisible(false);
            continue;
        }

        const auto email = contributorRows[index]->email->getText().trim();
        const auto labelText = email.isNotEmpty()
            ? "Send copy to contributor #" + juce::String(static_cast<int>(index) + 1) + ": " + email
            : "Contributor #" + juce::String(static_cast<int>(index) + 1) + " email missing";

        button->setButtonText(labelText);
        button->setEnabled(email.isNotEmpty());
        button->setToggleState(email.isNotEmpty() ? recipientSelections[index] : false, juce::dontSendNotification);
        if (email.isEmpty())
            recipientSelections[index] = false;
    }
}

void SplitSheetStudioEditor::refreshReviewSummary()
{
    const auto recipients = collectRecipientEmails();
    int signedCount = 0;
    for (const auto& row : contributorRows)
    {
        if (row->signaturePad->isSigned())
            ++signedCount;
    }

    juce::String summary;
    summary << "Song: " << (songTitleEditor.getText().trim().isNotEmpty() ? songTitleEditor.getText().trim() : "(missing)") << "\n";
    summary << "Alternate title: " << (alternateTitleEditor.getText().trim().isNotEmpty() ? alternateTitleEditor.getText().trim() : "None") << "\n";
    summary << "Date: " << (dateEditor.getText().trim().isNotEmpty() ? dateEditor.getText().trim() : "(missing)") << "\n";
    summary << "Location: " << (sessionLocationEditor.getText().trim().isNotEmpty() ? sessionLocationEditor.getText().trim() : "None") << "\n";
    summary << "Contributors: " << juce::String(static_cast<int>(contributorRows.size())) << "\n";
    summary << "Writer total: " << formatPercent(writerTotal()) << "   |   Publisher total: " << formatPercent(publisherTotal()) << "\n";
    summary << "Signature flow: " << (inviteToggle.getToggleState() ? "Invite links" : "In-session drawn signatures") << "\n";
    summary << "Typed signatures entered: ";

    int typedCount = 0;
    for (const auto& row : contributorRows)
    {
        if (row->typedSignatureName->getText().trim().isNotEmpty())
            ++typedCount;
    }

    summary << juce::String(typedCount) << "/" << juce::String(static_cast<int>(contributorRows.size())) << "\n";
    summary << "Drawn signatures captured: " << juce::String(signedCount) << "/" << juce::String(static_cast<int>(contributorRows.size())) << "\n";
    summary << "Recipients selected: " << juce::String(recipients.size()) << "\n";
    summary << "Agreement confirmed: " << (allPartiesAgreeToggle.getToggleState() ? "Yes" : "No");

    reviewSummaryLabel.setText(summary, juce::dontSendNotification);
}

void SplitSheetStudioEditor::refreshSubmitState()
{
    const auto message = validationMessage();
    const auto authed = isAuthenticated();
    submitButton.setEnabled(authed && message.isEmpty() && !restoringSession && currentStep == Step::review);
    validationLabel.setText(message.isNotEmpty() ? message : "Ready to send.",
                            juce::dontSendNotification);
    totalsLabel.setText("Writer total: " + formatPercent(writerTotal()) + "   |   Publisher total: " + formatPercent(publisherTotal()),
                        juce::dontSendNotification);
}

void SplitSheetStudioEditor::maybeGenerateBackendScreenshots()
{
    if (!backendScreenshotMode || backendScreenshotQueued)
        return;

    backendScreenshotQueued = true;
    juce::Component::SafePointer<SplitSheetStudioEditor> safeThis(this);
    juce::MessageManager::callAsync([safeThis]
    {
        if (safeThis == nullptr)
            return;

        auto& editor = *safeThis;
        if (!editor.backendScreenshotDir.exists())
            editor.backendScreenshotDir.createDirectory();

        if (auto* topLevel = editor.getTopLevelComponent())
            topLevel->setTopLeftPosition(-30000, -30000);

        editor.populateDemoScreenshotState();

        editor.switchStep(Step::song);
        editor.writeCurrentStepScreenshot(editor.backendScreenshotDir.getChildFile("plugin-song.png"),
                                          screenshotSongWidth, screenshotSongHeight);

        editor.switchStep(Step::contributors);
        editor.writeCurrentStepScreenshot(editor.backendScreenshotDir.getChildFile("plugin-contributors.png"),
                                          screenshotContributorsWidth, screenshotContributorsHeight);

        editor.switchStep(Step::review);
        editor.writeCurrentStepScreenshot(editor.backendScreenshotDir.getChildFile("plugin-review-send.png"),
                                          screenshotReviewWidth, screenshotReviewHeight);

        juce::Timer::callAfterDelay(150, []
        {
            if (auto* app = juce::JUCEApplicationBase::getInstance())
                app->systemRequestedQuit();
        });
    });
}

void SplitSheetStudioEditor::populateDemoScreenshotState()
{
    processor.getApiClient().setBaseUrl("https://app.splitsheetstudio.com");
    processor.setAccessToken("demo-access-token");
    processor.setRefreshToken("demo-refresh-token");
    processor.setUserEmail("blakmarigold@gmail.com");
    processor.setDisplayName("Blak Marigold");
    applyTheme(SplitSheetTheme::speakeasy, false);
    updateStatus("Signed in as Blak Marigold", palette.success);

    songTitleEditor.setText("Midnight Rights Session", juce::dontSendNotification);
    alternateTitleEditor.setText("Midnight Rights Session (Collab Mix)", juce::dontSendNotification);
    dateEditor.setText("2026-08-24", juce::dontSendNotification);
    sessionLocationEditor.setText("Blak Marigold Studio", juce::dontSendNotification);
    iswcEditor.setText("T-123.456.789-Z", juce::dontSendNotification);
    isrcEditor.setText("US-S1Z-26-00042", juce::dontSendNotification);
    notesEditor.setText("Remote feature workflow demo. Invite-based signatures, final delivery after all approvals.", juce::dontSendNotification);
    additionalRecipientOneEditor.clear();
    additionalRecipientTwoEditor.clear();
    inviteToggle.setToggleState(true, juce::dontSendNotification);
    supersedesPreviousToggle.setToggleState(true, juce::dontSendNotification);
    allPartiesAgreeToggle.setToggleState(true, juce::dontSendNotification);

    while (contributorRows.size() < 2)
        buildContributorRow();

    while (contributorRows.size() > 2)
        removeContributorRow(static_cast<int>(contributorRows.size()) - 1);

    if (contributorRows.size() >= 2)
    {
        auto& rowOne = *contributorRows[0];
        rowOne.legalName->setText("Blak Marigold", juce::dontSendNotification);
        rowOne.role->setSelectedId(2, juce::dontSendNotification);
        rowOne.address->setText("Austin, TX", juce::dontSendNotification);
        rowOne.phone->setText("512-555-0142", juce::dontSendNotification);
        rowOne.email->setText("blakmarigold@gmail.com", juce::dontSendNotification);
        rowOne.pro->setText("ASCAP", juce::dontSendNotification);
        rowOne.ipi->setText("00123456789", juce::dontSendNotification);
        rowOne.publisherName->setText("Marigold Rights Group", juce::dontSendNotification);
        rowOne.publisherIpi->setText("00987654321", juce::dontSendNotification);
        rowOne.writerShare->setText("50", juce::dontSendNotification);
        rowOne.publisherShare->setText("50", juce::dontSendNotification);
        rowOne.typedSignatureName->setText("Blak Marigold", juce::dontSendNotification);

        auto& rowTwo = *contributorRows[1];
        rowTwo.legalName->setText("Michael Smith", juce::dontSendNotification);
        rowTwo.role->setSelectedId(3, juce::dontSendNotification);
        rowTwo.address->setText("Atlanta, GA", juce::dontSendNotification);
        rowTwo.phone->setText("404-555-0188", juce::dontSendNotification);
        rowTwo.email->setText("blakmarigoldbiz@gmail.com", juce::dontSendNotification);
        rowTwo.pro->setText("BMI", juce::dontSendNotification);
        rowTwo.ipi->setText("00111222333", juce::dontSendNotification);
        rowTwo.publisherName->setText("Night Signal Publishing", juce::dontSendNotification);
        rowTwo.publisherIpi->setText("00999111222", juce::dontSendNotification);
        rowTwo.writerShare->setText("50", juce::dontSendNotification);
        rowTwo.publisherShare->setText("50", juce::dontSendNotification);
        rowTwo.typedSignatureName->setText("Michael Smith", juce::dontSendNotification);
    }

    recipientSelections.assign(contributorRows.size(), true);
    refreshRecipientButtons();
    refreshContributorCanvas();
    refreshReviewSummary();
    refreshSubmitState();
}

void SplitSheetStudioEditor::writeCurrentStepScreenshot(const juce::File& outputFile, int width, int height)
{
    setSize(width, height);
    refreshViewState();
    resized();
    repaint();

    if (currentStep == Step::contributors)
        contributorsViewport.setViewPosition(0, 0);

    const auto snapshot = createComponentSnapshot(getLocalBounds(), true, 1.5f);
    if (!snapshot.isValid())
        return;

    outputFile.getParentDirectory().createDirectory();
    juce::FileOutputStream output(outputFile);
    if (!output.openedOk())
        return;

    juce::PNGImageFormat png;
    png.writeImageToStream(snapshot, output);
    output.flush();
}

void SplitSheetStudioEditor::resetForm()
{
    songTitleEditor.clear();
    alternateTitleEditor.clear();
    dateEditor.setText(todayIso(), juce::dontSendNotification);
    sessionLocationEditor.clear();
    iswcEditor.clear();
    isrcEditor.clear();
    notesEditor.clear();
    additionalRecipientOneEditor.clear();
    additionalRecipientTwoEditor.clear();
    inviteToggle.setToggleState(true, juce::dontSendNotification);
    supersedesPreviousToggle.setToggleState(false, juce::dontSendNotification);
    allPartiesAgreeToggle.setToggleState(false, juce::dontSendNotification);

    while (contributorRows.size() > 1)
        removeContributorRow(static_cast<int>(contributorRows.size()) - 1);

    for (auto& row : contributorRows)
    {
        row->legalName->clear();
        row->role->setSelectedId(0, juce::dontSendNotification);
        row->address->clear();
        row->phone->clear();
        row->email->clear();
        row->pro->clear();
        row->ipi->clear();
        row->publisherName->clear();
        row->publisherIpi->clear();
        row->writerShare->clear();
        row->publisherShare->clear();
        row->typedSignatureName->clear();
        row->signaturePad->clear();
    }

    recipientSelections.assign(contributorRows.size(), true);
    switchStep(Step::song);
    refreshRecipientButtons();
    refreshReviewSummary();
    refreshSubmitState();
}

juce::String SplitSheetStudioEditor::validationMessage() const
{
    if (!isAuthenticated())
        return {};

    if (songTitleEditor.getText().trim().isEmpty())
        return "Enter the song title.";

    if (dateEditor.getText().trim().isEmpty())
        return "Enter the session date.";

    if (contributorRows.size() < 2)
        return "Add Contributor 2 to continue.";

    for (int index = 0; index < static_cast<int>(contributorRows.size()); ++index)
    {
        const auto& row = contributorRows[static_cast<size_t>(index)];
        const auto prefix = "Contributor " + juce::String(index + 1) + " ";

        if (row->legalName->getText().trim().isEmpty())
            return prefix + "needs a legal name.";
        if (row->role->getText().trim().isEmpty())
            return prefix + "needs a role.";
        if (row->email->getText().trim().isEmpty())
            return prefix + "needs an email.";
        if (row->writerShare->getText().trim().isEmpty())
            return prefix + "needs a writer share.";
        if (!inviteToggle.getToggleState())
        {
            if (row->typedSignatureName->getText().trim().isEmpty())
                return prefix + "needs a typed signature name.";
            if (!row->signaturePad->isSigned())
                return prefix + "needs a drawn signature.";
        }
    }

    if (std::abs(writerTotal() - 100.0) > 0.01)
        return "Writer shares must total exactly 100%.";

    if (std::abs(publisherTotal() - 100.0) > 0.01)
        return "Publisher shares must total exactly 100%. Leave them blank to mirror writer shares.";

    if (collectRecipientEmails().isEmpty())
        return "Select at least one recipient email.";

    if (!allPartiesAgreeToggle.getToggleState())
        return "Confirm that all parties reviewed and agree.";

    return {};
}

juce::var SplitSheetStudioEditor::buildSubmissionPayload() const
{
    auto* root = new juce::DynamicObject();
    root->setProperty("songTitle", songTitleEditor.getText().trim());
    root->setProperty("alternateTitle", alternateTitleEditor.getText().trim());
    root->setProperty("date", dateEditor.getText().trim());
    root->setProperty("sessionLocation", sessionLocationEditor.getText().trim());
    root->setProperty("iswc", iswcEditor.getText().trim());
    root->setProperty("isrc", isrcEditor.getText().trim());
    root->setProperty("notes", notesEditor.getText().trim());
    root->setProperty("supersedesPrevious", supersedesPreviousToggle.getToggleState());
    root->setProperty("allPartiesAgree", allPartiesAgreeToggle.getToggleState());
    root->setProperty("collectSignaturesByInvite", inviteToggle.getToggleState());

    juce::Array<juce::var> recipients;
    for (const auto& email : collectRecipientEmails())
        recipients.add(email);
    root->setProperty("recipientEmails", juce::var(recipients));

    juce::Array<juce::var> contributors;
    for (const auto& row : contributorRows)
    {
        auto* contributor = new juce::DynamicObject();
        contributor->setProperty("legalName", row->legalName->getText().trim());
        contributor->setProperty("role", row->role->getText().trim());
        contributor->setProperty("address", row->address->getText().trim());
        contributor->setProperty("phone", row->phone->getText().trim());
        contributor->setProperty("email", row->email->getText().trim());
        contributor->setProperty("pro", row->pro->getText().trim());
        contributor->setProperty("ipi", row->ipi->getText().trim());
        contributor->setProperty("publisherName", row->publisherName->getText().trim());
        contributor->setProperty("publisherIpi", row->publisherIpi->getText().trim());
        contributor->setProperty("writerShare", shareValue(row->writerShare->getText()));
        contributor->setProperty("publisherShare", effectivePublisherShare(*row->writerShare, *row->publisherShare));
        contributor->setProperty("typedSignatureName", row->typedSignatureName->getText().trim());
        contributor->setProperty("signatureData", row->signaturePad->toDataUrl());
        contributors.add(juce::var(contributor));
    }

    root->setProperty("contributors", juce::var(contributors));
    return juce::var(root);
}

juce::StringArray SplitSheetStudioEditor::collectRecipientEmails() const
{
    juce::StringArray recipients;

    for (size_t index = 0; index < contributorRows.size(); ++index)
    {
        if (index < recipientSelections.size() && recipientSelections[index])
        {
            const auto email = contributorRows[index]->email->getText().trim();
            if (email.isNotEmpty())
                recipients.addIfNotAlreadyThere(email);
        }
    }

    for (const auto& email : parseEmailTokens(additionalRecipientOneEditor.getText()))
        recipients.addIfNotAlreadyThere(email);
    for (const auto& email : parseEmailTokens(additionalRecipientTwoEditor.getText()))
        recipients.addIfNotAlreadyThere(email);

    return recipients;
}

double SplitSheetStudioEditor::writerTotal() const
{
    double total = 0.0;
    for (const auto& row : contributorRows)
        total += shareValue(row->writerShare->getText());
    return total;
}

double SplitSheetStudioEditor::publisherTotal() const
{
    double total = 0.0;
    for (const auto& row : contributorRows)
        total += effectivePublisherShare(*row->writerShare, *row->publisherShare);
    return total;
}

bool SplitSheetStudioEditor::isAuthenticated() const
{
    return processor.getAccessToken().isNotEmpty() || processor.getRefreshToken().isNotEmpty();
}

void SplitSheetStudioEditor::populateSignedInDefaults()
{
    const auto display = processor.getDisplayName().isNotEmpty() ? processor.getDisplayName() : processor.getUserEmail();
    welcomeLabel.setText("Signed in as " + display, juce::dontSendNotification);
}
