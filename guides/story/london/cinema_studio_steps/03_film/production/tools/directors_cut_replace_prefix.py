"""Copy a verified replacement video prefix and the original movie tail as packets.

Requires PyAV, like directors_cut_access.py. The splice must be a closed-GOP
keyframe in the original. This avoids MPEG-TS reinserting global parameter sets.
"""
import argparse
from fractions import Fraction
from pathlib import Path
import av

p = argparse.ArgumentParser()
p.add_argument('--prefix', type=Path, required=True)
p.add_argument('--source', type=Path, required=True)
p.add_argument('--output', type=Path, required=True)
p.add_argument('--seconds', type=Fraction, required=True)
a = p.parse_args()
assert not a.output.exists()
with av.open(str(a.prefix)) as head, av.open(str(a.source)) as original, av.open(str(a.output), 'w') as dst:
    hs, ss = head.streams.video[0], original.streams.video[0]
    st = dst.add_stream_from_template(hs)
    for packet in head.demux(hs):
        if not packet.size:
            continue
        assert packet.pts * packet.time_base < a.seconds
        packet.stream = st
        dst.mux(packet)
    first = True
    for packet in original.demux(ss):
        if not packet.size or packet.pts * packet.time_base < a.seconds:
            continue
        if first:
            assert packet.pts * packet.time_base == a.seconds and packet.is_keyframe
            # A CRA could depend on earlier pictures. Require an IDR for this splice.
            data = bytes(packet); offset = 0; vcl_types = []
            while offset < len(data):
                size = int.from_bytes(data[offset:offset+4], 'big'); offset += 4
                assert size >= 2 and offset + size <= len(data)
                nal_type = (data[offset] >> 1) & 63
                if nal_type < 32:
                    vcl_types.append(nal_type)
                offset += size
            assert vcl_types and all(t in (19, 20) for t in vcl_types)
            first = False
        packet.stream = st
        dst.mux(packet)
    assert not first
