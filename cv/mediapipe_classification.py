import cv2
import mediapipe as mp
import requests
import time

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_pose = mp.solutions.pose

def classify(results):
  if (
    results.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_ANKLE].visibility < 0.6 or
    results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_ANKLE].visibility < 0.6
    ):
    return None
  if (abs(results.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_ANKLE].z-
    results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_ANKLE].z)) <= 0.1:
    return 1 # Dribbling
  else:
    return 2 # Kicking

# For webcam input:
cap = cv2.VideoCapture(0)
with mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5) as pose:
  last = int(time.time())
  while cap.isOpened():
    success, image = cap.read()
    if not success:
      print("Ignoring empty camera frame.")
      # If loading a video, use 'break' instead of 'continue'.
      continue

    # To improve performance, optionally mark the image as not writeable to
    # pass by reference.
    image.flags.writeable = False
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(image)

    # Draw the pose annotation on the image.
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    mp_drawing.draw_landmarks(
        image,
        results.pose_landmarks,
        mp_pose.POSE_CONNECTIONS,
        landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style())
    
    cv2.imshow('MediaPipe Pose', cv2.flip(image, 2))
    
    if (int(time.time())-last >= 1):
      last = int(time.time())
      if (results.pose_landmarks is not None):
        res = classify(results)
        if res:
          print(res)
          r = requests.post("https://hackthenorth2022.uc.r.appspot.com/api/pose_types", {"data": res})
          print(r)
    if cv2.waitKey(5) & 0xFF == 27:
      break
cap.release()