import tempfile
import os
import shutil
from contextlib import contextmanager

@contextmanager
def temporary_file(suffix=".py", content=""):
    fd, path = tempfile.mkstemp(suffix=suffix, text=True)
    try:
        with os.fdopen(fd, 'w') as f:
            f.write(content)
        yield path
    finally:
        if os.path.exists(path):
            os.remove(path)

@contextmanager
def temporary_directory():
    path = tempfile.mkdtemp()
    try:
        yield path
    finally:
        if os.path.exists(path):
            shutil.rmtree(path)