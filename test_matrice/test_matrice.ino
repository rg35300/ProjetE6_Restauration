#include <Adafruit_NeoPixel.h>

// Define the number of LEDs in the matrix
#define NUM_LEDS 256

// Define the pin connected to the DIN pin of the matrix
#define DATA_PIN 12

// Create an instance of the Adafruit_NeoPixel library
Adafruit_NeoPixel matrix = Adafruit_NeoPixel(NUM_LEDS, DATA_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  matrix.begin(); // Initialize the matrix
  matrix.show();  // Turn off all LEDs initially
}

void loop() {
  // Example: Light up the matrix with a rainbow effect
  rainbowCycle(10); // Call the rainbowCycle function with a delay of 10ms
}

// Function to create a rainbow effect across the matrix
void rainbowCycle(uint8_t wait) {
  uint16_t i, j;

  for (j = 0; j < 256; j++) { // Cycle through all colors
    for (i = 0; i < matrix.numPixels(); i++) {
      matrix.setPixelColor(i, Wheel((i + j) & 255)); // Set pixel color
    }
    matrix.show(); // Update the matrix
    delay(wait);   // Wait for the specified delay
  }
}

// Helper function to generate rainbow colors
uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if (WheelPos < 85) {
    return matrix.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  } else if (WheelPos < 170) {
    WheelPos -= 85;
    return matrix.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  } else {
    WheelPos -= 170;
    return matrix.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
  }
}
