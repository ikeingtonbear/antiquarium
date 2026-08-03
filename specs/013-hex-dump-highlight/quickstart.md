# Quickstart: Hex Dump to Layer Highlight

## Testing the Interaction

When this feature is implemented, you can verify it in the UI as follows:

1. Open the Antiquarium web interface.
2. Load a packet capture file and navigate to the packet details view of any frame.
3. **Hex to Layer**: Hover over a byte in the Hex Dump view. The deepest corresponding layer in the Layer View should highlight in light gray.
4. Click a byte in the Hex Dump view. The deepest corresponding layer in the Layer View should highlight in blue and remain highlighted when the mouse moves away.
5. **Layer to Hex**: Hover over a layer node in the Layer View. The corresponding bytes in the Hex Dump should highlight in light gray.
6. Click a layer node in the Layer View. The corresponding bytes in the Hex Dump should highlight in blue and remain highlighted.
7. **Simultaneous Display**: While a layer or byte is selected (blue), hovering over a different byte/layer will show the light gray hover highlight *in addition to* the blue selection highlight.
