import cv2
import os
import sys
import time

# Configuration constants
VIDEO_PATH = r"C:\Users\legit\Desktop\JS TTRL\AURA FARMING\aura_farming_kid.mp4" #put your mp4 file path
ASCII_CHARS = " .:-=+*#%@"
MAX_DURATION = 10

def frame_to_ascii(frame, width=120):  # Increased width for better detail
    """Convert a video frame to ASCII art"""
    height, width_orig = frame.shape[:2]
    new_height = int(height * width / width_orig * 0.4)  # Adjusted ratio
    
    resized = cv2.resize(frame, (width, new_height))
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    
    ascii_art = ""
    for row in gray:
        line = ""
        for pixel in row:
            char_index = min(int(pixel / 255 * (len(ASCII_CHARS) - 1)), len(ASCII_CHARS) - 1)
            line += ASCII_CHARS[char_index]
        ascii_art += line + "\n"
    
    return ascii_art

def clear_screen():
    """Clear the terminal screen"""
    if os.name == 'nt':
        os.system('cls')
    else:
        os.system('clear')

# Main execution
print("Loading video...")

cap = cv2.VideoCapture(VIDEO_PATH)

if not cap.isOpened():
    print(f"ERROR: Cannot open video file: {VIDEO_PATH}")
    input("Press Enter to exit...")
    sys.exit(1)

# Get video properties
fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

# Process frames
frames_to_process = min(int(fps * MAX_DURATION), total_frames)
frame_interval = max(1, int(fps / 12))  # 12 FPS processing

ascii_frames = []
frame_count = 0
processed_count = 0

while cap.isOpened() and frame_count < frames_to_process:
    ret, frame = cap.read()
    if not ret:
        break
    
    if frame_count % frame_interval == 0:
        ascii_frame = frame_to_ascii(frame, width=100)  # Optimized width
        ascii_frames.append(ascii_frame)
        processed_count += 1
    
    frame_count += 1

cap.release()

if not ascii_frames:
    print("ERROR: No frames processed!")
    input("Press Enter to exit...")
    sys.exit(1)

print(f"Ready! {len(ascii_frames)} frames. Starting in 2 seconds... (Ctrl+C to stop)")
time.sleep(2)

# Play ASCII animation
try:
    playback_fps = 10
    frame_delay = 1.0 / playback_fps
    
    while True:
        for ascii_frame in enumerate(ascii_frames):
            clear_screen()
            print(ascii_frame[1], end='')  # No extra newlines
            time.sleep(frame_delay)

except KeyboardInterrupt:
    clear_screen()
    print("Stopped!")
    
finally:
    input("Press Enter to exit...")
