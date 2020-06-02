import numpy as np
import hashlib
import random

# ##########################################################################
# Example of an encrypted system in operation.  This works with a few
# assumptions that can be adjusted:
#    * Getting within approximately 70' is close enough to note
#    * "Infection" sticks around for 2 hours
#
# Questions can be directed to TripleBlind, Inc.  This code and algorithm
# is donated to the Private Kit project.


# ##########################################################################
# InfectedUser

class InfectedUser:
    def __init__(self):
        self.salt = str(random.randint(0, 2 ** 100)).encode("utf-8")

    def infected_helper_generation(self, location, thresholds):
        distance_threshold = thresholds[0]
        time_threshold = int(thresholds[1] / 2)
        lat = int(location[0] * 10 ** 6)
        long = int(location[1] * 10 ** 6)
        time_ = int(
            location[2] + time_threshold / 2
        )  # an origin for time is needed let's say the day the app is released
        template = [lat, long, time_]
        random_x = random.randint(
            int((-90 * 10 ** 6) / (2 * distance_threshold)),
            int((90 * 10 ** 6) / (2 * distance_threshold)),
        )
        random_y = random.randint(
            int((-180 * 10 ** 6) / (2 * distance_threshold)),
            int((180 * 10 ** 6) / (2 * distance_threshold)),
        )
        random_time = random.randint(0, 2 ** 50)
        lattice_point_x = random_x * 2 * distance_threshold
        lattice_point_y = random_y * 2 * distance_threshold
        lattice_point_z = random_time * 2 * time_threshold
        lattice_point = np.array([lattice_point_x, lattice_point_y, lattice_point_z])
        translation_vector = lattice_point - template
        hash_complexity = 1000000
        dk = hashlib.pbkdf2_hmac(
            "sha256", str(lattice_point).encode("utf-8"), self.salt, hash_complexity
        )

        return translation_vector, dk.hex()

# #########################################################################

def user_hash_generation(query, translation_vector, salt, thresholds):
    lat = int(query[0] * 10 ** 6)
    long = int(query[1] * 10 ** 6)
    time_ = int(query[2])
    distance_threshold = thresholds[0]
    time_threshold = int(thresholds[1] / 2)
    query = np.array([lat, long, time_])
    translated_query = query + translation_vector

    quantized_query = (
        2
        * distance_threshold
        * np.ceil(
            (translated_query[0:2] - distance_threshold) / (2 * distance_threshold)
        ).astype(np.int64)
    )
    quantized_time = (
        2
        * time_threshold
        * np.ceil((translated_query[2] - time_threshold) / (2 * time_threshold)).astype(
            np.int64
        )
    )
    quantized_out = np.array([quantized_query[0], quantized_query[1], quantized_time])
    encoded = str(quantized_out).encode("utf-8")
    hash_complexity = 1000000
    dk = hashlib.pbkdf2_hmac("sha256", encoded, salt, hash_complexity)
    return dk.hex()

#
# The infected user do the following
#    * Store a set of points in GPS lat/lon coordinate system
#    * Generate the unique hash and helper data


user1_locations = np.array(
    [[41.403380, 39.289342, 32], [2.192491, 145.293971, 55]]
)  # [lat,long,time]
inf_user = InfectedUser()
thresholds = [300, 2]  # .000300 is approximately 70 feet #TODO: More accurate threshold
# 2 hours threshold

user1_helper_data = []
for i in range(user1_locations.shape[0]):
    user1_helper_data.append(
        inf_user.infected_helper_generation(user1_locations[i], thresholds)
    )


print(user1_helper_data[0][1], "infected point hash")
"""
The hash of the infected point is stored at the server but the other helper data translation vector, salt
is sent to all users


"""

translation_vector = user1_helper_data[0][0]
salt = inf_user.salt
current_location1 = np.array([41.403380, 39.289342, 32])  # exact match
current_location2 = np.array([41.403280, 39.289142, 33])  # within threshold (
current_location3 = np.array([41.403280, 39.289142, 31])  # before the infection
current_location4 = np.array([41.401380, 39.289342, 31])  # safe area
print(
    user_hash_generation(current_location1, translation_vector, salt, thresholds),
    "This point is close to an infected point within 2 hours",
)
print(
    user_hash_generation(current_location2, translation_vector, salt, thresholds),
    "This point is close to an infected point within 2 hours",
)
print(
    user_hash_generation(current_location3, translation_vector, salt, thresholds),
    "This point is safe",
)
print(
    user_hash_generation(current_location4, translation_vector, salt, thresholds),
    "This point is safe",
)


"""The Hash is sent to the server and server  perform the matching """
