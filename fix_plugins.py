import os
import glob

def fix_files():
    files = glob.glob('src/plugins/**/*.v', recursive=True)
    for file_path in files:
        with open(file_path, 'r') as f:
            content = f.read()
        
        # We need to fix the mess first.
        # The mess looks like "mut app mut app core.Appcore.App"
        # It should be "mut app &core.App"
        
        # First, let's remove the duplicated mess
        import re
        content = re.sub(r'mut app mut app core\.Appcore\.App', 'mut app &core.App', content)
        content = re.sub(r'mut app core\.App', 'mut app &core.App', content)
        
        with open(file_path, 'w') as f:
            f.write(content)

if __name__ == '__main__':
    fix_files()
