#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

Adafruit_MPU6050 mpu;

// corrected for gravity
float gravity[3] {0, 0, 0};
float acceleration[3] {0, 0, 0};
float velocity[3] {0, 0, 0};

float orientation[3] {0, 0, 0};

// set current frame as reference for gravity
void calibrate() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  gravity[0] = a.acceleration.x;
  gravity[1] = a.acceleration.y;
  gravity[2] = a.acceleration.z;

  acceleration[0] = acceleration[1] = acceleration[2] = 0;
  velocity[0] = velocity[1] = velocity[2] = 0;
  orientation[0] = orientation[1] = orientation[2] = 0;

  delay(200);
}

void setup(void) {
  Serial.begin(115200);
  // Try to initialize!
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");

  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  Serial.print("Accelerometer range set to: ");
  switch (mpu.getAccelerometerRange()) {
  case MPU6050_RANGE_2_G:
    Serial.println("+-2G");
    break;
  case MPU6050_RANGE_4_G:
    Serial.println("+-4G");
    break;
  case MPU6050_RANGE_8_G:
    Serial.println("+-8G");
    break;
  case MPU6050_RANGE_16_G:
    Serial.println("+-16G");
    break;
  }
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  Serial.print("Gyro range set to: ");
  switch (mpu.getGyroRange()) {
  case MPU6050_RANGE_250_DEG:
    Serial.println("+- 250 deg/s");
    break;
  case MPU6050_RANGE_500_DEG:
    Serial.println("+- 500 deg/s");
    break;
  case MPU6050_RANGE_1000_DEG:
    Serial.println("+- 1000 deg/s");
    break;
  case MPU6050_RANGE_2000_DEG:
    Serial.println("+- 2000 deg/s");
    break;
  }

  mpu.setFilterBandwidth(MPU6050_BAND_5_HZ);
  Serial.print("Filter bandwidth set to: ");
  switch (mpu.getFilterBandwidth()) {
  case MPU6050_BAND_260_HZ:
    Serial.println("260 Hz");
    break;
  case MPU6050_BAND_184_HZ:
    Serial.println("184 Hz");
    break;
  case MPU6050_BAND_94_HZ:
    Serial.println("94 Hz");
    break;
  case MPU6050_BAND_44_HZ:
    Serial.println("44 Hz");
    break;
  case MPU6050_BAND_21_HZ:
    Serial.println("21 Hz");
    break;
  case MPU6050_BAND_10_HZ:
    Serial.println("10 Hz");
    break;
  case MPU6050_BAND_5_HZ:
    Serial.println("5 Hz");
    break;
  }

  delay(500);

  calibrate();
}

void loop() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // update current orientation
  orientation[0] += g.gyro.x*0.1;
  orientation[1] += g.gyro.y*0.1;
  orientation[2] += g.gyro.z*0.1;

  // rotation matrix
  float R[3][3] =
  {
    { cos(orientation[2])*cos(orientation[1]), cos(orientation[2])*sin(orientation[1])*sin(orientation[0]) - sin(orientation[2])*cos(orientation[0]) , cos(orientation[2])*sin(orientation[1])*cos(orientation[0]) + sin(orientation[2])*sin(orientation[0])},
    { sin(orientation[2])*cos(orientation[1]), sin(orientation[2])*sin(orientation[1])*sin(orientation[0]) + cos(orientation[2])*cos(orientation[0]) , sin(orientation[2])*sin(orientation[1])*cos(orientation[0]) - cos(orientation[2])*sin(orientation[0])},
    { -1 * sin(orientation[1]), cos(orientation[1]) * sin(orientation[0]), cos(orientation[1]) * cos(orientation[0])}
  };

  // correct for gravity when setting acceleration
  acceleration[0] = a.acceleration.x*R[0][0] + a.acceleration.y*R[0][1] + a.acceleration.z*R[0][2] - gravity[0];
  acceleration[1] = a.acceleration.x*R[1][0] + a.acceleration.y*R[1][1] + a.acceleration.z*R[1][2] - gravity[1];
  acceleration[2] = a.acceleration.x*R[2][0] + a.acceleration.y*R[2][1] + a.acceleration.z*R[2][2] - gravity[2];

  Serial.print(gravity[0]);
  Serial.print(" ");
  Serial.print(gravity[1]);
  Serial.print(" ");
  Serial.print(gravity[2]);
  Serial.println(" ");

  /* Print out the values */
  Serial.print("Acceleration X: ");
  Serial.print(acceleration[0]);
  Serial.print(", Y: ");
  Serial.print(acceleration[1]);
  Serial.print(", Z: ");
  Serial.print(acceleration[2]);
  Serial.println(" m/s^2");

  Serial.println("");
  delay(100);
}